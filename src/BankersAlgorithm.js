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

  // Find all possible safe sequences
  const safeSequences = []; // Store all safe sequences
  let totalSequences = 0; // Count total safe sequences

  const findSafeSequences = (sequence, work, finish) => {
    if (sequence.length === numProcesses) {
      // Found a valid safe sequence
      safeSequences.push([...sequence]); // Add to the list of safe sequences
      totalSequences++; // Increment the total count
      return;
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
          const newWork = [...work];
          for (let j = 0; j < numResources; j++) {
            newWork[j] += allocation[i][j];
          }
          finish[i] = true;
          sequence.push(i);

          // Display progress (only for the first sequence)
          if (totalSequences === 0) {
            outputDiv.innerHTML += `<p>Process ${i} can proceed</p>`;
            outputDiv.innerHTML += `<p>Updated Work: ${JSON.stringify(newWork)}</p>`;
          }

          // Recur to find more sequences
          findSafeSequences(sequence, newWork, finish);

          // Backtrack
          finish[i] = false;
          sequence.pop();
        }
      }
    }
  };

  findSafeSequences([], work, finish);

  // Display the safe sequence (only the first one)
  if (safeSequences.length > 0) {
    outputDiv.innerHTML += `<h3>Safe Sequence:</h3>`;
    outputDiv.innerHTML += `<p>${safeSequences[0].join(", ")}</p>`;
  }

  // Display the total number of possible safe sequences
  outputDiv.innerHTML += `<h3>Total Possible Safe Sequences: ${totalSequences}</h3>`;

  return {
    isSafe: totalSequences > 0,
    safeSequence: safeSequences[0] || [], // Return the first safe sequence (if any)
    totalSequences,
  };
};