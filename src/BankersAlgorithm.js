export const isSafe2 = (allocation, max, available) => {
  const numProcesses = allocation.length;
  const numResources = available.length;

  // Get the output div from the HTML
  const outputDiv = document.getElementById('output');

  // Clear the previous content
  outputDiv.innerHTML = '';

  // Calculate Need matrix
  const need = Array(numProcesses).fill(0).map(() =>
    Array(numResources).fill(0)
  );
  for (let i = 0; i < numProcesses; i++) {
    for (let j = 0; j < numResources; j++) {
      need[i][j] = max[i][j] - allocation[i][j];
    }
  }

  // Display Need Matrix as a table in the output div
  outputDiv.innerHTML += '<h3>Need Matrix:</h3>';
  let table = '<table border="1" style="border-collapse: collapse; margin: 20px 0; width: 100%;">';
  table += '<thead><tr><th>Process</th>';
  for (let i = 0; i < numResources; i++) {
    table += `<th>R${i + 1}</th>`;
  }
  table += '</tr></thead><tbody>';
  for (let i = 0; i < numProcesses; i++) {
    table += `<tr><td>P${i}</td>`;
    for (let j = 0; j < numResources; j++) {
      table += `<td>${need[i][j]}</td>`;
    }
    table += '</tr>';
  }
  table += '</tbody></table>';
  outputDiv.innerHTML += table;

  // Work and Finish arrays
  const work = [...available];
  const finish = Array(numProcesses).fill(false);

  // Find one safe sequence and count total possible sequences
  let safeSequence = [];
  let totalSequences = 0;

  const findSafeSequence = () => {
    if (safeSequence.length === numProcesses) {
      totalSequences++;
      return true; // Stop after finding one sequence
    }

    for (let i = 0; i < numProcesses; i++) {
      if (!finish[i]) {
        let canProceed = true;
        for (let j = 0; j < numResources; j++) {
          if (need[i][j] > work[j]) {
            canProceed = false;
            break;
          }
        }

        if (canProceed) {
          // Simulate process finishing
          for (let j = 0; j < numResources; j++) {
            work[j] += allocation[i][j];
          }
          finish[i] = true;
          safeSequence.push(i);

          // Display progress
          outputDiv.innerHTML += `<p>Process ${i} can proceed</p>`;
          outputDiv.innerHTML += `<p>Updated Work: ${JSON.stringify(work)}</p>`;

          if (findSafeSequence()) {
            return true; // Stop after finding one sequence
          }

          // Backtrack
          finish[i] = false;
          safeSequence.pop();
          for (let j = 0; j < numResources; j++) {
            work[j] -= allocation[i][j];
          }
        }
      }
    }
    return false;
  };

  findSafeSequence();

  // Display the safe sequence
  outputDiv.innerHTML += `<h3>Safe Sequence:</h3>`;
  outputDiv.innerHTML += `<pre>${JSON.stringify(safeSequence)}</pre>`;

  // Display the total number of possible safe sequences
  outputDiv.innerHTML += `<p>Possible sequences: ${totalSequences}</p>`;

  return {
    isSafe: safeSequence.length === numProcesses,
    safeSequence,
    totalSequences,
  };
};