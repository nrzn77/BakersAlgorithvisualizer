import { isSafe2 } from "./BankersAlgorithm";
import React, { useState } from "react";
import Papa from "papaparse"; // For CSV parsing

// MatrixInput component for dynamic input fields for matrices
const MatrixInput = ({
  title,
  matrix,
  setMatrix,
  numProcesses,
  numResources,
  handleMatrixChange,
}) => (
  <div>
    <h2>{title}</h2>
    <table>
      <tbody>
        {Array.from({ length: numProcesses }, (_, row) => (
          <tr key={row}>
            {Array.from({ length: numResources }, (_, col) => (
              <td key={col}>
                <input
                  type="number"
                  value={matrix[row][col]}
                  onChange={(e) =>
                    handleMatrixChange(matrix, setMatrix, row, col, e.target.value)
                  }
                  style={{ width: "50px" }}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// VectorInput component for dynamic input fields for vectors
const VectorInput = ({
  title,
  vector,
  setVector,
  numResources,
  handleVectorChange,
}) => (
  <div>
    <h2>{title}</h2>
    <table>
      <tbody>
        <tr>
          {Array.from({ length: numResources }, (_, i) => (
            <td key={i}>
              <input
                type="number"
                value={vector[i]}
                onChange={(e) =>
                  handleVectorChange(setVector, i, e.target.value)
                }
                style={{ width: "50px" }}
              />
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  </div>
);

// Main App component
const App = () => {
  const [numProcesses, setNumProcesses] = useState(0); // Initialize to 0, will update based on CSV
  const [numResources, setNumResources] = useState(0); // Initialize to 0, will update based on CSV

  // Initialize matrices with empty values
  const [allocation, setAllocation] = useState([]);
  const [max, setMax] = useState([]);
  const [available, setAvailable] = useState([]);

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null); // For error messages

  // Function to handle input changes for matrices
  const handleMatrixChange = (matrix, setMatrix, row, col, value) => {
    const updatedMatrix = [...matrix];
    updatedMatrix[row][col] = parseInt(value, 10) || 0;
    setMatrix(updatedMatrix);
  };

  // Function to handle input changes for available resources
  const handleVectorChange = (setVector, index, value) => {
    const updatedVector = [...available];
    updatedVector[index] = parseInt(value, 10) || 0;
    setVector(updatedVector);
  };

  // Function to handle CSV file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    Papa.parse(file, {
      header: true, // Use the first row as headers
      complete: (results) => {
        const data = results.data;
        if (data.length === 0) {
          setError("CSV file is empty.");
          return;
        }
  
        // Check for required columns in the header
        const headers = results.meta.fields;
        if (
          !headers ||
          !headers.includes("PID") ||
          !headers.includes("Allocation_A") ||
          !headers.includes("Max_A")
        ) {
          setError("Invalid CSV format. Ensure the columns match the required format.");
          return;
        }
  
        // Determine the number of processes and resources
        const numProcesses = data.length;
        const numResources = Object.keys(data[0]).filter((key) =>
          key.startsWith("Allocation_")
        ).length;
  
        // Extract allocation, max, and available from CSV
        const allocation = [];
        const max = [];
        let available = [];
  
        for (let i = 0; i < numProcesses; i++) {
          const row = data[i];
          if (!row.PID || !row.Allocation_A || !row.Max_A) {
            setError("Invalid CSV format. Ensure the columns match the required format.");
            return;
          }
  
          // Extract allocation for each process
          const allocationRow = [];
          for (let j = 0; j < numResources; j++) {
            const value = row[`Allocation_${String.fromCharCode(65 + j)}`];
            allocationRow.push(value === "-" ? 0 : parseInt(value, 10)); // Replace hyphens with 0
          }
          allocation.push(allocationRow);
  
          // Extract max for each process
          const maxRow = [];
          for (let j = 0; j < numResources; j++) {
            const value = row[`Max_${String.fromCharCode(65 + j)}`];
            maxRow.push(value === "-" ? 0 : parseInt(value, 10)); // Replace hyphens with 0
          }
          max.push(maxRow);
  
          // Extract available resources from the first row only
          if (i === 0) {
            available = Array.from({ length: numResources }, (_, j) => {
              const value = row[`Available_${String.fromCharCode(65 + j)}`];
              return value === "-" ? 0 : parseInt(value, 10); // Replace hyphens with 0
            });
          }
        }
  
        // Validate allocation and available resources
        for (let i = 0; i < numProcesses; i++) {
          for (let j = 0; j < numResources; j++) {
            if (allocation[i][j] > available[j]) {
              setError(`Allocated resources for process ${i} exceed available resources.`);
              return;
            }
          }
        }
  
        // Update state with parsed data
        setNumProcesses(numProcesses);
        setNumResources(numResources);
        setAllocation(allocation);
        setMax(max);
        setAvailable(available);
        setError(null); // Clear any previous errors
      },
      error: (err) => {
        setError("Error parsing CSV file. Please check the file format.");
      },
    });
  };
  // Function to check system safety and get one safe sequence
  const checkSafety = () => {
    const { isSafe, safeSequence, totalSequences } = isSafe2(allocation, max, available);
    setResult({ isSafe, safeSequence, totalSequences });
  };

  return (
    <div className="App">
      <h1>Banker's Algorithm Visualizer</h1>

      {/* File Upload Input */}
      <div>
        <input type="file" accept=".csv" onChange={handleFileUpload} />
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      <div className="matrix-container">
        <MatrixInput
          title="Allocation"
          matrix={allocation}
          setMatrix={setAllocation}
          numProcesses={numProcesses}
          numResources={numResources}
          handleMatrixChange={handleMatrixChange}
        />
        <MatrixInput
          title="Max"
          matrix={max}
          setMatrix={setMax}
          numProcesses={numProcesses}
          numResources={numResources}
          handleMatrixChange={handleMatrixChange}
        />
        <VectorInput
          title="Available"
          vector={available}
          setVector={setAvailable}
          numResources={numResources}
          handleVectorChange={handleVectorChange}
        />
      </div>

      <button onClick={checkSafety}>Check System Safety</button>

      {result && (
        <div>
          <h3>System is {result.isSafe ? "Safe" : "Unsafe"}!</h3>
          {result.isSafe && (
            <div>
              <p>Safe Sequence: {result.safeSequence.join(", ")}</p>
              <p>Total Possible Safe Sequences: {result.totalSequences}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;