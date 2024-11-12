// Set up the canvas and context
const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 60; // Account for taskbar height

let nodes = [];
let edges = [];
let selectedNodes = [];
let isAddingNode = false;
let isAddingEdge = false;
let isRemovingNode = false;
let isRemovingEdge = false;
let nodeCounter = 1; // Start node numbering from 1

// Canvas interaction functions
function addNode(x, y) {
    nodes.push({ x, y, label: nodeCounter++ }); // Assign a label based on nodeCounter and increment it
    refreshCanvas();
}

function addEdge(startNode, endNode) {
    // Prompt user for the weight of the edge
    const weight = prompt("Enter weight for this edge:", "1");
    edges.push({ startNode, endNode, weight: parseInt(weight) || 1 }); // Use entered weight or default to 1 if input is invalid
    refreshCanvas();
}

function removeNode(x, y) {
    nodes = nodes.filter(node => {
        const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
        return distance > 12; // Node radius for detection
    });
    // Also remove edges associated with this node
    edges = edges.filter(edge => {
        const distanceToStart = Math.sqrt((edge.startNode.x - x) ** 2 + (edge.startNode.y - y) ** 2);
        const distanceToEnd = Math.sqrt((edge.endNode.x - x) ** 2 + (edge.endNode.y - y) ** 2);
        return distanceToStart > 12 && distanceToEnd > 12;
    });
    refreshCanvas();
}

function removeEdge(x, y) {
    edges = edges.filter(edge => {
        // Calculate distance from click point to the line segment of the edge
        const distToEdge = distanceToSegment({ x, y }, edge.startNode, edge.endNode);
        return distToEdge > 10; // Threshold for edge removal
    });
    refreshCanvas();
}

function clearCanvas() {
    nodes = [];
    edges = [];
    selectedNodes = [];
    nodeCounter = 1; // Reset node numbering
    refreshCanvas();
}

function refreshCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawEdges();
    drawNodes();
}

// Draw nodes and edges
function drawNodes() {
    ctx.fillStyle = 'black';
    nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 12, 0, Math.PI * 2);
        ctx.fill();

        // Draw the node label
        ctx.fillStyle = 'blue';
        ctx.font = '12px Arial';
        ctx.fillText(`N${node.label}`, node.x - 10, node.y - 15); // Display the node number above the node
    });
}

function drawEdges() {
    ctx.strokeStyle = 'black'; // Set edge color to black
    ctx.lineWidth = 3; // Slightly thicker
    edges.forEach(edge => {
        const { startNode, endNode, weight } = edge;
        ctx.beginPath();
        ctx.moveTo(startNode.x, startNode.y);
        ctx.lineTo(endNode.x, endNode.y);
        ctx.stroke();

        // Draw the weight label
        const midX = (startNode.x + endNode.x) / 2;
        const midY = (startNode.y + endNode.y) / 2;
        ctx.fillStyle = 'red';
        ctx.font = '12px Arial';
        ctx.fillText(weight, midX, midY); // Display the weight at the midpoint of the edge
    });
}

// Event listeners for dropdown actions
document.getElementById('addNode').addEventListener('click', () => {
    isAddingNode = true;
    isAddingEdge = false;
    isRemovingNode = false;
    isRemovingEdge = false;
});

document.getElementById('addEdge').addEventListener('click', () => {
    isAddingEdge = true;
    isAddingNode = false;
    isRemovingNode = false;
    isRemovingEdge = false;
});

document.getElementById('removeNode').addEventListener('click', () => {
    isRemovingNode = true;
    isAddingNode = false;
    isAddingEdge = false;
    isRemovingEdge = false;
});

document.getElementById('removeEdge').addEventListener('click', () => {
    isRemovingEdge = true;
    isAddingNode = false;
    isAddingEdge = false;
    isRemovingNode = false;
});

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (isAddingNode) {
        addNode(x, y);
    } else if (isAddingEdge) {
        const clickedNode = findNearestNode(x, y);
        if (clickedNode) {
            selectedNodes.push(clickedNode);
            if (selectedNodes.length === 2) {
                addEdge(selectedNodes[0], selectedNodes[1]);
                selectedNodes = []; // Reset for the next edge
            }
        } else {
            // If no node is clicked, reset selected nodes
            selectedNodes = [];
        }
    } else if (isRemovingNode) {
        removeNode(x, y);
    } else if (isRemovingEdge) {
        removeEdge(x, y);
    }
});

// Change Canvas Color functionality
document.querySelectorAll('.dropdown-content a[data-color]').forEach(link => {
    link.addEventListener('click', (event) => {
        const color = event.target.getAttribute('data-color');
        canvas.style.backgroundColor = color;
    });
});

// Utility function to find the nearest node
function findNearestNode(x, y) {
    return nodes.find(node => {
        const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
        return distance <= 12; // Node radius for selection
    });
}

// Utility function to calculate distance from a point to a line segment
function distanceToSegment(point, v, w) {
    const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
    if (l2 === 0) return Math.sqrt((point.x - v.x) ** 2 + (point.y - v.y) ** 2);
    let t = ((point.x - v.x) * (w.x - v.x) + (point.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    const projX = v.x + t * (w.x - v.x);
    const projY = v.y + t * (w.y - v.y);
    return Math.sqrt((point.x - projX) ** 2 + (point.y - projY) ** 2);
}

document.getElementById('clearCanvas').addEventListener('click', clearCanvas);
