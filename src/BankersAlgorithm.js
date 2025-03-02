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
  
  // Create the table structure
  let table = '<table border="1" style="border-collapse: collapse; margin: 20px 0; width: 100%;">';
  table += '<thead><tr><th>Process</th>';
  
  // Add column headers for each resource
  for (let i = 0; i < numResources; i++) {
    table += `<th>R${i + 1}</th>`;
  }
  table += '</tr></thead><tbody>';

  // Add rows for each process
  for (let i = 0; i < numProcesses; i++) {
    table += `<tr><td>P${i}</td>`;
    for (let j = 0; j < numResources; j++) {
      table += `<td>${need[i][j]}</td>`;
    }
    table += '</tr>';
  }
  table += '</tbody></table>';

  // Append the table to the output div
  outputDiv.innerHTML += table;

  // Work and Finish arrays
  const work = [...available];
  const finish = Array(numProcesses).fill(false);

  // Find a process that can proceed
  let safeSequence = [];
  let processesFinished = 0;

  while (processesFinished < numProcesses) {
    let found = false;
    for (let i = 0; i < numProcesses; i++) {
      if (!finish[i]) {
        let canProceed = true;
        for (let j = 0; j < numResources; j++) {
          if (need[i][j] > work[j]) {
            canProceed = false;
            break;
          }
        }

        // If the process can proceed, simulate it finishing
        if (canProceed) {
          // Update the work array
          for (let j = 0; j < numResources; j++) {
            work[j] += allocation[i][j];  // Correctly update work by adding allocated resources
          }
          safeSequence.push(i);
          finish[i] = true;
          processesFinished++;
          found = true;

          // Display progress
          outputDiv.innerHTML += `<p>Process ${i} can proceed</p>`;
          outputDiv.innerHTML += `<p>Updated Work: ${JSON.stringify(work)}</p>`;
        }
      }
    }

    // If no process could proceed, system is unsafe
    if (!found) {
      outputDiv.innerHTML += '<p>No process can proceed, system is unsafe.</p>';
      return { isSafe: false, safeSequence: [] };
    }
  }

  // Display the safe sequence
  outputDiv.innerHTML += `<h3>Safe Sequence:</h3>`;
  outputDiv.innerHTML += `<pre>${JSON.stringify(safeSequence)}</pre>`;
  return { isSafe: true, safeSequence };
};
