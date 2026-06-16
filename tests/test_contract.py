"""Tests for the FreelanceJury contract path: ruling is derived deterministically
from client_pct, and the validator rejects any ruling that doesn't match the band."""
import freelance_jury as C


def ruling_for(p): return C._ruling_for(p)


def validator_ok(data):
    pct = data.get("client_pct")
    if isinstance(pct, bool) or not isinstance(pct, int) or pct < 0 or pct > 100:
        return False
    if not isinstance(data.get("reasoning"), str) or not data["reasoning"].strip():
        return False
    return data.get("ruling") == ruling_for(pct)


def test_band_boundaries():
    assert ruling_for(100) == "client"
    assert ruling_for(67) == "client"
    assert ruling_for(66) == "split"
    assert ruling_for(50) == "split"
    assert ruling_for(34) == "split"
    assert ruling_for(33) == "freelancer"
    assert ruling_for(0) == "freelancer"


def test_normalize_clamps_and_derives():
    out = C._normalize_ruling({"client_pct": 150, "reasoning": "x"})
    assert out["client_pct"] == 100 and out["ruling"] == "client"
    out = C._normalize_ruling({"client_pct": -20, "reasoning": "y"})
    assert out["client_pct"] == 0 and out["ruling"] == "freelancer"
    out = C._normalize_ruling({"client_pct": 50, "reasoning": "z"})
    assert out["ruling"] == "split"


def test_normalize_handles_bad_pct():
    out = C._normalize_ruling({"client_pct": "abc"})
    assert out["client_pct"] == 50 and out["ruling"] == "split"
    assert out["reasoning"]  # non-empty default


def test_normalized_always_validates():
    for p in [0, 10, 33, 34, 50, 66, 67, 90, 100, 250, -5]:
        assert validator_ok(C._normalize_ruling({"client_pct": p, "reasoning": "r"}))


def test_validator_rejects_mismatched_ruling():
    assert validator_ok({"ruling": "client", "client_pct": 10, "reasoning": "r"}) is False
    assert validator_ok({"ruling": "freelancer", "client_pct": 90, "reasoning": "r"}) is False


def test_validator_rejects_bad_pct_and_empty_reason():
    assert validator_ok({"ruling": "split", "client_pct": 200, "reasoning": "r"}) is False
    assert validator_ok({"ruling": "split", "client_pct": True, "reasoning": "r"}) is False
    assert validator_ok({"ruling": "split", "client_pct": 50, "reasoning": "  "}) is False
