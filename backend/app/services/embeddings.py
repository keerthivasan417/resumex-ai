"""Lazy local embedding generation using a configurable open-source model."""

from collections.abc import Callable
from typing import Protocol

from app.core.config import settings


class EmbeddingModel(Protocol):
    """Subset of the sentence-transformers interface used by this application."""

    def encode(self, sentences: list[str], *, normalize_embeddings: bool) -> object:
        """Encode supplied text into normalized vector rows."""


class EmbeddingConfigurationError(ValueError):
    """Raised when model output does not match configured vector dimensions."""


class LocalEmbeddingService:
    """Generate normalized embeddings without loading a model until first use."""

    def __init__(
        self,
        model_name: str | None = None,
        dimensions: int | None = None,
        model_loader: Callable[[str], EmbeddingModel] | None = None,
    ) -> None:
        self.model_name = model_name or settings.embedding_model
        self.dimensions = dimensions or settings.embedding_dimensions
        self._model_loader = model_loader or _load_sentence_transformer
        self._model: EmbeddingModel | None = None

    def embed(self, text: str) -> list[float]:
        """Return one normalized embedding vector for non-empty text."""
        if not text.strip():
            raise ValueError("Text to embed cannot be empty.")
        encoded = self._get_model().encode([text], normalize_embeddings=True)
        vector = [float(value) for value in encoded[0]]  # type: ignore[index]
        if len(vector) != self.dimensions:
            raise EmbeddingConfigurationError(
                f"Model {self.model_name!r} produced {len(vector)} dimensions; "
                f"EMBEDDING_DIMENSIONS is configured as {self.dimensions}."
            )
        return vector

    def _get_model(self) -> EmbeddingModel:
        if self._model is None:
            self._model = self._model_loader(self.model_name)
        return self._model


def _load_sentence_transformer(model_name: str) -> EmbeddingModel:
    """Load a local or cached sentence-transformers model on first embedding request."""
    from sentence_transformers import SentenceTransformer

    return SentenceTransformer(model_name)
