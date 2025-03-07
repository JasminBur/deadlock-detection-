function checkDeadlock() {
    const result = document.getElementById('result');
    const numProcesses = document.getElementById('processes').value;
    const numResources = document.getElementById('resources').value;

    // Gather the available resources from the table
    const available = [];
    const availableTable = document.getElementById('availableTable').getElementsByTagName('input');
    for (let i = 0; i < numResources; i++) {
        available.push(parseInt(availableTable[i].value));
    }

    // Gather the allocation matrix from the table
    const allocation = [];
    const allocationTable = document.getElementById('allocationTable').getElementsByTagName('input');
    for (let i = 0; i < numProcesses; i++) {
        const row = [];
        for (let j = 0; j < numResources; j++) {
            row.push(parseInt(allocationTable[i * numResources + j].value));
        }
        allocation.push(row);
    }

    // Gather the max matrix from the table
    const maxMatrix = [];
    const maxTable = document.getElementById('maxTable').getElementsByTagName('input');
    for (let i = 0; i < numProcesses; i++) {
        const row = [];
        for (let j = 0; j < numResources; j++) {
            row.push(parseInt(maxTable[i * numResources + j].value));
        }
        maxMatrix.push(row);
    }

    // Send the data to the Flask backend
    fetch('/check_deadlock', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            num_processes: numProcesses,
            num_resources: numResources,
            available: available,
            allocation: allocation,
            max_matrix: maxMatrix
        })
    })
    .then(response => response.json())
    .then(data => {
        // Display the result
        if (data.result === 'Safe State') {
            result.textContent = `System is in Safe State! Safe Sequence: ${data.safe_sequence.join(' → ')}`;
            result.classList.add('safe-state');
        } else {
            result.textContent = "Deadlock Detected!";
            result.classList.remove('safe-state');
        }
        result.style.display = 'block';
    })
    .catch(error => {
        console.error('Error:', error);
        result.textContent = "Error checking the deadlock state!";
        result.classList.remove('safe-state');
        result.style.display = 'block';
    });
}
