/**
 * Zero-dependency standard ZIP (PKZip) generator for client-side recruiter export packages.
 * Produces valid uncompressed (Store) ZIP archives compatible with Windows Explorer, macOS, and Linux unzip.
 */

// CRC-32 table
const makeCrcTable = () => {
  let c;
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[n] = c;
  }
  return table;
};

const crcTable = makeCrcTable();

const crc32 = (buf: Uint8Array): number => {
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ (-1)) >>> 0;
};

export interface ZipEntry {
  name: string;
  data: Uint8Array | string;
}

export function createClientZip(files: ZipEntry[]): Blob {
  const encoder = new TextEncoder();
  const fileRecords: Array<{
    nameBytes: Uint8Array;
    dataBytes: Uint8Array;
    crc: number;
    offset: number;
  }> = [];

  const parts: Uint8Array[] = [];
  let currentOffset = 0;

  // 1. Write Local File Headers + Data
  for (const file of files) {
    const nameBytes = encoder.encode(file.name);
    const dataBytes = typeof file.data === "string" ? encoder.encode(file.data) : file.data;
    const crc = crc32(dataBytes);

    const localHeader = new Uint8Array(30 + nameBytes.length);
    const view = new DataView(localHeader.buffer);

    // Signature: 0x04034b50
    view.setUint32(0, 0x04034b50, true);
    view.setUint16(4, 10, true); // Version needed (1.0)
    view.setUint16(6, 0, true);  // General purpose bit flag
    view.setUint16(8, 0, true);  // Compression method (0 = store)
    view.setUint16(10, 0, true); // Last mod time
    view.setUint16(12, 0, true); // Last mod date
    view.setUint32(14, crc, true);
    view.setUint32(18, dataBytes.length, true); // Compressed size
    view.setUint32(22, dataBytes.length, true); // Uncompressed size
    view.setUint16(26, nameBytes.length, true);
    view.setUint16(28, 0, true); // Extra field length

    localHeader.set(nameBytes, 30);

    parts.push(localHeader);
    parts.push(dataBytes);

    fileRecords.push({
      nameBytes,
      dataBytes,
      crc,
      offset: currentOffset,
    });

    currentOffset += localHeader.length + dataBytes.length;
  }

  const centralDirectoryOffset = currentOffset;
  let centralDirectorySize = 0;

  // 2. Write Central Directory Headers
  for (const rec of fileRecords) {
    const cdHeader = new Uint8Array(46 + rec.nameBytes.length);
    const view = new DataView(cdHeader.buffer);

    // Signature: 0x02014b50
    view.setUint32(0, 0x02014b50, true);
    view.setUint16(4, 20, true); // Version made by (2.0)
    view.setUint16(6, 10, true); // Version needed (1.0)
    view.setUint16(8, 0, true);  // General purpose bit flag
    view.setUint16(10, 0, true); // Compression method (0 = store)
    view.setUint16(12, 0, true); // Mod time
    view.setUint16(14, 0, true); // Mod date
    view.setUint32(16, rec.crc, true);
    view.setUint32(20, rec.dataBytes.length, true); // Compressed size
    view.setUint32(24, rec.dataBytes.length, true); // Uncompressed size
    view.setUint16(28, rec.nameBytes.length, true);
    view.setUint16(30, 0, true); // Extra field length
    view.setUint16(32, 0, true); // Comment length
    view.setUint16(34, 0, true); // Disk number start
    view.setUint16(36, 0, true); // Internal attributes
    view.setUint32(38, 0, true); // External attributes
    view.setUint32(42, rec.offset, true); // Relative offset of local header

    cdHeader.set(rec.nameBytes, 46);
    parts.push(cdHeader);

    centralDirectorySize += cdHeader.length;
    currentOffset += cdHeader.length;
  }

  // 3. Write End of Central Directory Record (EOCD)
  const eocd = new Uint8Array(22);
  const eocdView = new DataView(eocd.buffer);

  // Signature: 0x06054b50
  eocdView.setUint32(0, 0x06054b50, true);
  eocdView.setUint16(4, 0, true); // Disk number
  eocdView.setUint16(6, 0, true); // Disk with central directory
  eocdView.setUint16(8, fileRecords.length, true); // Number of records on this disk
  eocdView.setUint16(10, fileRecords.length, true); // Total number of records
  eocdView.setUint32(12, centralDirectorySize, true); // Size of central directory
  eocdView.setUint32(16, centralDirectoryOffset, true); // Offset of start of central directory
  eocdView.setUint16(20, 0, true); // Comment length

  parts.push(eocd);

  return new Blob(parts, { type: "application/zip" });
}
