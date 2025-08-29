import fitz  # PyMuPDF
from PIL import Image
import os

# Open the PDF file
pdf_path = "PDF/partner dashboard status.pdf"
pdf_document = fitz.open(pdf_path)

images = []

# Convert each page to image
for page_num in range(len(pdf_document)):
    page = pdf_document[page_num]
    
    # Set zoom factor for high quality (2x zoom)
    mat = fitz.Matrix(2, 2)  # 2x zoom for better quality
    pix = page.get_pixmap(matrix=mat)
    
    # Save temporary image
    temp_path = f"page_{page_num}.png"
    pix.save(temp_path)
    images.append(Image.open(temp_path))
    print(f"Converted page {page_num + 1}")

# Combine all images vertically
if images:
    total_width = images[0].width
    total_height = sum(img.height for img in images)
    
    # Create a new image with combined height
    combined_image = Image.new('RGB', (total_width, total_height), 'white')
    
    # Paste each image one below the other
    y_offset = 0
    for img in images:
        combined_image.paste(img, (0, y_offset))
        y_offset += img.height
    
    # Save the combined image
    combined_image.save("dashboard.png")
    
    # Clean up temporary files
    for page_num in range(len(pdf_document)):
        os.remove(f"page_{page_num}.png")
    
    print(f"All {len(pdf_document)} pages combined into dashboard.png")

pdf_document.close()