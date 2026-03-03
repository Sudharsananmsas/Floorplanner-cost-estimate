import fitz  # PyMuPDF
import os 
from typing import List

def pdf_to_images(pdf_path: str, out_dir: str, dpi: int = 200) -> List[str]:
    doc = fitz.open(pdf_path)
    out_paths = []

    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        mat = fitz.Matrix(dpi / 72, dpi / 72)
        pix = page.get_pixmap(matrix=mat)

        out_file = os.path.join(out_dir, f"page_{page_num + 1}.png")
        pix.save(out_file)
        out_paths.append(out_file)

    doc.close()
    return out_paths