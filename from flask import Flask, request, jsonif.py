from flask import Flask, request, jsonify

app = Flask(__name__)

# Function to check for deadlock using Banker's Algorithm (or any other algorithm you choose)
def is_safe_state(available, allocation, max_matrix, num_processes, num_resources):
    # This is a simple implementation of the Banker's Algorithm or a custom check
    work = available[:]
    finish = [False] * num_processes
    safe_sequence = []

    while len(safe_sequence) < num_processes:
        progress_made = False
        for i in range(num_processes):
            if not finish[i]:
                # Check if the process can finish with the available resources
                if all(max_matrix[i][j] - allocation[i][j] <= work[j] for j in range(num_resources)):
                    # Add the allocation of this process to the work array
                    for j in range(num_resources):
                        work[j] += allocation[i][j]
                    finish[i] = True
                    safe_sequence.append(i)
                    progress_made = True
                    break
        if not progress_made:
            return False, []  # No progress made, so it's a deadlock
    
    return True, safe_sequence


@app.route('/check_deadlock', methods=['POST'])
def check_deadlock():
    # Extract the data sent by the frontend
    data = request.get_json()
    
    num_processes = data['num_processes']
    num_resources = data['num_resources']
    
    available = data['available']
    allocation = data['allocation']
    max_matrix = data['max_matrix']
    
    # Check for deadlock or safe state
    is_safe, safe_sequence = is_safe_state(available, allocation, max_matrix, num_processes, num_resources)
    
    if is_safe:
        return jsonify({
            'result': 'Safe State',
            'safe_sequence': safe_sequence
        })
    else:
        return jsonify({
            'result': 'Deadlock Detected',
            'safe_sequence': []
        })

if __name__ == '__main__':
    app.run(debug=True)
