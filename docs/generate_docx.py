import os
import re
from datetime import datetime
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

def add_toc(document):
    paragraph = document.add_paragraph()
    run = paragraph.add_run()
    fldChar = OxmlElement('w:fldChar')
    fldChar.set(qn('w:fldCharType'), 'begin')
    instrText = OxmlElement('w:instrText')
    instrText.set(qn('xml:space'), 'preserve')
    instrText.text = 'TOC \\o "1-3" \\h \\z \\u'
    fldChar2 = OxmlElement('w:fldChar')
    fldChar2.set(qn('w:fldCharType'), 'separate')
    fldChar3 = OxmlElement('w:fldChar')
    fldChar3.set(qn('w:fldCharType'), 'end')

    r_element = run._r
    r_element.append(fldChar)
    r_element.append(instrText)
    r_element.append(fldChar2)
    r_element.append(fldChar3)

doc = Document()

# Define styles
styles = doc.styles
for style in styles:
    if hasattr(style, 'font'):
        style.font.name = 'Arial'

# Cover Page
title = doc.add_heading('AIVI Career Intelligence Full Documentation', 0)
title.alignment = WD_ALIGN_PARAGRAPH.CENTER
doc.add_paragraph('\n')

subtitle = doc.add_paragraph('Investor-Grade Product Overview & Feature Walkthrough\n')
subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
for run in subtitle.runs:
    run.font.size = Pt(16)
    
url = doc.add_paragraph('Website: https://aivilabs.com\n')
url.alignment = WD_ALIGN_PARAGRAPH.CENTER
version = doc.add_paragraph('Version 1.0\n')
version.alignment = WD_ALIGN_PARAGRAPH.CENTER
date = doc.add_paragraph(f'Date: {datetime.now().strftime("%B %d, %Y")}\n')
date.alignment = WD_ALIGN_PARAGRAPH.CENTER

doc.add_page_break()

# Executive Overview
doc.add_heading('Executive Overview', level=1)
doc.add_paragraph('AIVI is a premium, AI-powered Career Intelligence platform that converts generic resumes into highly ATS-optimized, mathematically quantified professional documents. This documentation breaks down the complete user journey, from the top-of-funnel landing page and signup flow to the core capabilities including Resume Intelligence, Resume Rebuild, Job Fit Analysis, Skill Roadmaps, Interview Prep, Promotion Readiness, Portfolio Analyzer, and LinkedIn Analyzer.')

# Table of contents
doc.add_heading('Table of Contents', level=1)
# Note: Word needs to update field for TOC to populate
toc_para = doc.add_paragraph()
toc_para.add_run('Note: Please right-click here and select "Update Field" in Microsoft Word to generate the Table of Contents.').italic = True
add_toc(doc)
doc.add_page_break()

# Technical Architecture Overview (High Level Only)
doc.add_heading('Technical Architecture Overview', level=1)
doc.add_paragraph('AIVI is built on a modern, scalable stack utilizing React/TypeScript for the frontend, Node.js and Google Cloud Functions for serverless backend processing, and Firebase/Firestore for real-time data synchronization and authentication. Core intelligence is powered by Google Gemini 2.5 Flash APIs, with server-side quota, rate-limit, and logging controls to keep career guidance reliable and auditable.')
doc.add_page_break()

md_path = 'AIVI_Product_Documentation.md'
with open(md_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

skip_mode = True
current_figure = 1

for line in lines:
    line = line.strip()
    if not line:
        continue
    
    if line.startswith('## Part 1'):
        skip_mode = False

    if skip_mode:
        continue

    if "- *Nano Banana Annotation:*" in line:
        continue
    if "**Visual Requirement:**" in line:
        continue
    
    if line.startswith('## '):
        doc.add_heading(line[3:], level=1)
    elif line.startswith('### '):
        heading_text = line[4:]
        # Extract section number like "1.1 " for Figure naming context
        section_match = re.search(r'^(\d+\.\d+)\s*(.*)', heading_text)
        if section_match:
            sec_num = section_match.group(1)
        doc.add_heading(heading_text, level=2)
    elif line.startswith('![') and '](' in line:
        match = re.search(r'!\[([^\]]+)\]\(([^)]+)\)', line)
        if match:
            alt_text = match.group(1)
            img_path = match.group(2)
            
            img_path = img_path.replace('./images/', 'images/')
            
            if os.path.exists(img_path):
                # Add image
                para = doc.add_paragraph()
                para.alignment = WD_ALIGN_PARAGRAPH.CENTER
                run = para.add_run()
                # Maintain consistent size
                run.add_picture(img_path, width=Inches(6.0))
                
                # Add caption
                cap_para = doc.add_paragraph()
                cap_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
                cap_run = cap_para.add_run(f'Figure {current_figure} - {alt_text}')
                cap_run.italic = True
                cap_run.font.size = Pt(10)
                cap_run.font.color.rgb = RGBColor(100, 100, 100)
                current_figure += 1
            else:
                doc.add_paragraph(f'[Image missing: {img_path}]')
    elif line.startswith('- '):
        para = doc.add_paragraph(style='List Bullet')
        parts = re.split(r'(\*\*.*?\*\*)', line[2:])
        for part in parts:
            if part.startswith('**') and part.endswith('**'):
                run = para.add_run(part[2:-2])
                run.bold = True
            else:
                para.add_run(part)
    elif line.startswith('1. ') or line.startswith('2. ') or line.startswith('3. ') or line.startswith('4. '):
        doc.add_paragraph(line[3:], style='List Number')
    elif line == '---' or line == '**End of Documentation**':
        continue
    else:
        # regular text
        para = doc.add_paragraph()
        parts = re.split(r'(\*\*.*?\*\*)', line)
        for part in parts:
            if part.startswith('**') and part.endswith('**'):
                run = para.add_run(part[2:-2])
                run.bold = True
            else:
                para.add_run(part)

doc.add_page_break()
doc.add_heading('Conclusion', level=1)
doc.add_paragraph('The AIVI Career Intelligence platform demonstrates a highly robust, feature-complete suite of tools designed to optimize the job-seeking process. The core value loop from Resume Builder to Job Fit, coupled with intelligence features like Interview Prep and Skill Roadmaps, positions AIVI as an essential, premium utility for career growth.')

# Add page numbers to footer
for section in doc.sections:
    footer = section.footer
    para = footer.paragraphs[0]
    para.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = para.add_run()
    fldChar1 = OxmlElement('w:fldChar')
    fldChar1.set(qn('w:fldCharType'), 'begin')
    instrText = OxmlElement('w:instrText')
    instrText.set(qn('xml:space'), 'preserve')
    instrText.text = "PAGE"
    fldChar2 = OxmlElement('w:fldChar')
    fldChar2.set(qn('w:fldCharType'), 'end')
    run._r.append(fldChar1)
    run._r.append(instrText)
    run._r.append(fldChar2)

output_path = 'AIVI_Career_Intelligence_Full_Documentation.docx'
doc.save(output_path)
print(f"Saved {output_path}")
