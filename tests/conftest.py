import sys, types, importlib.util
from pathlib import Path

def _install_fake_genlayer():
    m = types.ModuleType("genlayer")
    def passthrough(fn=None, **_kw):
        return (lambda f: f) if fn is None else fn
    class _Public:
        write = staticmethod(passthrough); view = staticmethod(passthrough)
    class _Return:
        def __init__(self, calldata): self.calldata = calldata
    class _VM:
        Return = _Return
        @staticmethod
        def run_nondet_unsafe(leader_fn, _validator_fn): return leader_fn()
    class _Msg: sender_address = "0x0000000000000000000000000000000000000000"
    class _Web:
        @staticmethod
        def get(*_a, **_k):
            class R: body = b""
            return R()
    class _Nondet:
        web = _Web()
        @staticmethod
        def exec_prompt(*_a, **_k): return "{}"
    class _GL:
        public = _Public(); vm = _VM(); message = _Msg(); nondet = _Nondet()
        class Contract: pass
    class _U256(int):
        def __new__(cls, v=0): return int.__new__(cls, int(v))
    class _TreeMap(dict):
        def __class_getitem__(cls, _i): return cls
    m.gl=_GL(); m.u256=_U256; m.i256=_U256; m.bigint=int; m.TreeMap=_TreeMap
    m.DynArray=list; m.Address=str; m.allow_storage=passthrough
    sys.modules["genlayer"]=m

_install_fake_genlayer()
_C = Path(__file__).resolve().parents[1] / "judiciary" / "freelance_jury.py"
_spec = importlib.util.spec_from_file_location("freelance_jury", _C)
freelance_jury = importlib.util.module_from_spec(_spec)
sys.modules["freelance_jury"] = freelance_jury
_spec.loader.exec_module(freelance_jury)
