'''
This module converts the images to embeddings for similarity check.
'''

import numpy as np
from PIL import Image
import torch
import clip 
from torchvision import transforms

class Embedder:
    def __init__(self, device=None):
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")
        self.model, self.preprocess = clip.load("ViT-B/32", device=self.device)
        self.model.eval()

    def embed_pil(self, pil_image: Image.Image) -> np.ndarray:
        img = pil_image.convert("RGB")
        x = self.preprocess(img).unsqueeze(0).to(self.device)
        with torch.no_grad():
            emb = self.model.encode_image(x)
            emb = emb / emb.norm(dim=-1, keepdim=True)
        return emb.cpu().numpy().reshape(-1)
