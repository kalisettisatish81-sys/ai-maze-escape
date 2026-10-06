import { runFullAlgorithmTestSuite } from './algorithms.test';

console.log('----------------------------------------------------');
console.log('🤖 AI MAZE ESCAPE - COMPREHENSIVE ALGORITHM TEST SUITE');
console.log('----------------------------------------------------');

const { passed, failed, results } = runFullAlgorithmTestSuite();

results.forEach((r, idx) => {
  const status = r.passed ? '✓ PASS' : '✗ FAIL';
  console.log(`${idx + 1}. [${status}] ${r.name}`);
  if (!r.passed && r.message) {
    console.error(`   Error: ${r.message}`);
  }
});

console.log('----------------------------------------------------');
console.log(`TOTAL: ${results.length} | PASSED: ${passed} | FAILED: ${failed}`);
console.log('----------------------------------------------------');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL ALGORITHM UNIT TESTS PASSED SUCCESSFULLY!');
  process.exit(0);
}
