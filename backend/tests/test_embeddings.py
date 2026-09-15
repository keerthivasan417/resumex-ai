"""Unit tests for lazy local embedding generation without model downloads."""

import pytest

from app.services.embeddings import EmbeddingConfigurationError, LocalEmbeddingService


class _FakeEmbeddingModel:
    def __init__(self, vector: list[float]) -> None:
        self.vector = vector
        self.calls: list[list[str]] = []

    def encode(self, sentences: list[str], *, normalize_embeddings: bool) -> list[list[float]]:
        assert normalize_embeddings is True
        self.calls.append(sentences)
        return [self.vector]


def test_embedding_service_is_lazy_and_deterministic() -> None:
    """Injected models avoid downloads and produce stable vectors for the same text."""
    model = _FakeEmbeddingModel([0.1, 0.2, 0.3])
    loader_calls: list[str] = []
    service = LocalEmbeddingService(
        model_name="local-test-model",
        dimensions=3,
        model_loader=lambda name: (loader_calls.append(name) or model),
    )

    assert loader_calls == []
    assert service.embed("resume chunk") == [0.1, 0.2, 0.3]
    assert service.embed("resume chunk") == [0.1, 0.2, 0.3]
    assert loader_calls == ["local-test-model"]
    assert model.calls == [["resume chunk"], ["resume chunk"]]


def test_embedding_service_rejects_dimension_mismatch() -> None:
    """Configured database dimensions must match model output dimensions."""
    service = LocalEmbeddingService(
        model_name="local-test-model",
        dimensions=2,
        model_loader=lambda _: _FakeEmbeddingModel([0.1, 0.2, 0.3]),
    )

    with pytest.raises(EmbeddingConfigurationError, match="produced 3 dimensions"):
        service.embed("resume chunk")
