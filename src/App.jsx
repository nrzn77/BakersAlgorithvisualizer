import { isSafe2 } from "./BankersAlgorithm";
import React, { useState } from "react"; 

const App = () => {
  const [numProcesses, setNumProcesses] = useState(5); // Default number of processes
  const [numResources, setNumResources] = useState(3); // Default number of resources

  // Initialize matrices with default values
  const [allocation, setAllocation] = useState([
    [0, 1, 0],
    [2, 0, 0],
    [3, 0, 2],
    [2, 1, 1],
    [0, 0, 2],
  ]);

  const [max, setMax] = useState([
    [7, 5, 3],
    [3, 2, 2],
    [9, 0, 2],
    [2, 2, 2],
    [4, 3, 3],
  ]);

  const [available, setAvailable] = useState([3, 3, 2]);

  const [result, setResult] = useState(null);

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

  const checkSafety = () => {
    const { isSafe, safeSequence } = isSafe2(allocation, max, available);
    setResult({ isSafe, safeSequence });
  };

  return (
    <div className="App">
      <h1>Banker's Algorithm Visualizer</h1>

      <div className="matrix-container">
        <MatrixInput
          title="Allocation"
          matrix={allocation}
          setMatrix={setAllocation}
          numProcesses={numProcesses}
          numResources={numResources}
          handleMatrixChange={handleMatrixChange} // Pass the function here
        />
        <MatrixInput
          title="Max"
          matrix={max}
          setMatrix={setMax}
          numProcesses={numProcesses}
          numResources={numResources}
          handleMatrixChange={handleMatrixChange} // Pass the function here
        />
        <VectorInput
          title="Available"
          vector={available}
          setVector={setAvailable}
          numResources={numResources}
          handleVectorChange={handleVectorChange} // Pass the function here
        />
      </div>

      <button onClick={checkSafety}>Check System Safety</button>

      {result && (
        <div>
          <h3>System is {result.isSafe ? "Safe" : "Unsafe"}!</h3>
          {result.isSafe && (
            <p>Safe Sequence: {result.safeSequence.join(", ")}</p>
          )}
        </div>
      )}
    </div>
  );
};

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

export default App;
