import Score, { ScoreEvent } from '../../lib/score/Score';

describe('Score', () => {
  test('emits event on update', (done) => {
    const score = new Score();

    score.addListener(ScoreEvent.UPDATE, () => {
      expect(score.score).toBe(13);
      expect(score.lines).toBe(37);

      done();
    });

    score.update({
      gameId: 'beef',
      score: 13,
      lines: 37,
    });
  });
});
