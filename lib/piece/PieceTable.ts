export const enum PieceName {
  I = 73,
  O = 79,
  L = 76,
  J = 74,
  S = 83,
  T = 84,
  Z = 90,
  B = 66,
}

const I = PieceName.I;
const O = PieceName.O;
const L = PieceName.L;
const J = PieceName.J;
const S = PieceName.S;
const T = PieceName.T;
const Z = PieceName.Z;

// prettier-ignore
const pieceDataI = [
  new Uint8Array([
    0, 0, 0, 0,
    0, 0, 0, 0,
    I, I, I, I,
    0, 0, 0, 0
  ]),
  new Uint8Array([
    0, 0, I, 0,
    0, 0, I, 0,
    0, 0, I, 0,
    0, 0, I, 0
  ])
];

// prettier-ignore
const pieceDataO = [ new Uint8Array([
  0, 0, 0, 0,
  0, O, O, 0,
  0, O, O, 0,
  0, 0, 0, 0
]) ];

// prettier-ignore
const pieceDataJ = [
  new Uint8Array([
    0, 0, 0, 0,
    J, J, J, 0,
    0, 0, J, 0,
    0, 0, 0, 0
  ]),
  new Uint8Array([
    0, J, 0, 0,
    0, J, 0, 0,
    J, J, 0, 0,
    0, 0, 0, 0
  ]),
  new Uint8Array([
    J, 0, 0, 0,
    J, J, J, 0,
    0, 0, 0, 0,
    0, 0, 0, 0
  ]),
  new Uint8Array([
    0, J, J, 0,
    0, J, 0, 0,
    0, J, 0, 0,
    0, 0, 0, 0
  ])
];

// prettier-ignore
const pieceDataL = [
  new Uint8Array([
    0, 0, 0, 0,
    L, L, L, 0,
    L, 0, 0, 0,
    0, 0, 0, 0
  ]),
  new Uint8Array([
    L, L, 0, 0,
    0, L, 0, 0,
    0, L, 0, 0,
    0, 0, 0, 0
  ]),
  new Uint8Array([
    0, 0, L, 0,
    L, L, L, 0,
    0, 0, 0, 0,
    0, 0, 0, 0
  ]),
  new Uint8Array([
    0, L, 0, 0,
    0, L, 0, 0,
    0, L, L, 0,
    0, 0, 0, 0
  ])
];

// prettier-ignore
const pieceDataS = [
  new Uint8Array([
    0, 0, 0, 0,
    0, S, S, 0,
    S, S, 0, 0,
    0, 0, 0, 0
  ]),
  new Uint8Array([
    0, S, 0, 0,
    0, S, S, 0,
    0, 0, S, 0,
    0, 0, 0, 0
  ]),
  new Uint8Array([
    0, 0, 0, 0,
    0, S, S, 0,
    S, S, 0, 0,
    0, 0, 0, 0
  ]),
  new Uint8Array([
    0, S, 0, 0,
    0, S, S, 0,
    0, 0, S, 0,
    0, 0, 0, 0
  ])
];

// prettier-ignore
const pieceDataT = [
  new Uint8Array([
    0, 0, 0, 0,
    T, T, T, 0,
    0, T, 0, 0,
    0, 0, 0, 0
  ]),
  new Uint8Array([
    0, T, 0, 0,
    T, T, 0, 0,
    0, T, 0, 0,
    0, 0, 0, 0
  ]),
  new Uint8Array([
    0, T, 0, 0,
    T, T, T, 0,
    0, 0, 0, 0,
    0, 0, 0, 0
  ]),
  new Uint8Array([
    0, T, 0, 0,
    0, T, T, 0,
    0, T, 0, 0,
    0, 0, 0, 0
  ])
];

// prettier-ignore
const pieceDataZ = [
  new Uint8Array([
    0, 0, 0, 0,
    Z, Z, 0, 0,
    0, Z, Z, 0,
    0, 0, 0, 0
  ]),
  new Uint8Array([
    0, 0, Z, 0,
    0, Z, Z, 0,
    0, Z, 0, 0,
    0, 0, 0, 0
  ]),
  new Uint8Array([
    0, 0, 0, 0,
    Z, Z, 0, 0,
    0, Z, Z, 0,
    0, 0, 0, 0
  ]),
  new Uint8Array([
    0, 0, Z, 0,
    0, Z, Z, 0,
    0, Z, 0, 0,
    0, 0, 0, 0
  ])
];

export const PieceTable: { [k in PieceName]: Uint8Array[] } = {
  [PieceName.I]: pieceDataI,
  [PieceName.O]: pieceDataO,
  [PieceName.L]: pieceDataL,
  [PieceName.J]: pieceDataJ,
  [PieceName.S]: pieceDataS,
  [PieceName.T]: pieceDataT,
  [PieceName.Z]: pieceDataZ,
  [PieceName.B]: [],
};

const clampRotation = (pieceName: PieceName, rot: number): number => {
  return rot % (PieceTable[pieceName] || []).length;
};

export const getPieceDataXY = (pieceName: PieceName, rot: number, x: number, y: number): number => {
  return PieceTable[pieceName][clampRotation(pieceName, rot)][y * 4 + x];
};
