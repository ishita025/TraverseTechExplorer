// Set up the canvas and context
const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 60; // Adjust for taskbar height

let nodes = [];
let edges = [];
let selectedNodes = [];
let isAddingNode = false;
let isAddingEdge = false;
let isRemovingNode = false;
let isRemovingEdge = false;
let selectedAlgorithm = 'bfs'; // Default algorithm
let isVisualizing = false;
let traversalSteps = [];
let currentStep = 0;

// Utility functions
function refreshCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawEdges();
    drawNodes();
}

function findNearestNode(x, y) {
    return nodes.find(node => {
        const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
        return distance <= 12; // Node radius for selection
    });
}

function distanceToSegment(point, v, w) {
    const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
    if (l2 === 0) return Math.sqrt((point.x - v.x) ** 2 + (point.y - v.y) ** 2);
    let t = ((point.x - v.x) * (w.x - v.x) + (point.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    const projX = v.x + t * (w.x - v.x);
    const projY = v.y + t * (w.y - v.y);
    return Math.sqrt((point.x - projX) ** 2 + (point.y - projY) ** 2);
}

// Node and edge management
function addNode(x, y) {
    const nodeNumber = nodes.length + 1;
    nodes.push({ x, y, number: nodeNumber, color: 'rgb(8, 83, 109)' });
    refreshCanvas();
}

function addEdge(startNode, endNode, weight = 1) {
    edges.push({ startNode, endNode, weight, color: 'rgb(8, 83, 109)' });
    refreshCanvas();
}

function removeNode(x, y) {
    nodes = nodes.filter(node => {
        const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
        return distance > 12;
    });
    edges = edges.filter(edge => {
        const distanceToStart = Math.sqrt((edge.startNode.x - x) ** 2 + (edge.startNode.y - y) ** 2);
        const distanceToEnd = Math.sqrt((edge.endNode.x - x) ** 2 + (edge.endNode.y - y) ** 2);
        return distanceToStart > 12 && distanceToEnd > 12;
    });
    refreshCanvas();
}

function removeEdge(x, y) {
    edges = edges.filter(edge => {
        const distToEdge = distanceToSegment({ x, y }, edge.startNode, edge.endNode);
        return distToEdge > 10;
    });
    refreshCanvas();
}

function clearCanvas() {
    nodes = [];
    edges = [];
    selectedNodes = [];
    refreshCanvas();
}

// Draw functions
function drawNodes() {
    nodes.forEach(node => {
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 12, 0, Math.PI * 2);
        ctx.fill();

        // Draw node number
        ctx.fillStyle = 'white';
        ctx.font = "12px Arial";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.number, node.x, node.y);
    });
}

function drawEdges() {
    ctx.lineWidth = 3;
    edges.forEach(edge => {
        const { startNode, endNode, weight } = edge;
        ctx.strokeStyle = edge.color;
        ctx.beginPath();
        ctx.moveTo(startNode.x, startNode.y);
        ctx.lineTo(endNode.x, endNode.y);
        ctx.stroke();

        // Draw edge weight
        const midX = (startNode.x + endNode.x) / 2;
        const midY = (startNode.y + endNode.y) / 2;
        ctx.fillStyle = 'black';
        ctx.font = "12px Arial";
        ctx.fillText(weight, midX, midY);
    });
}

// Dropdown actions
document.getElementById('addNode').addEventListener('click', () => {
    isAddingNode = true;
    isAddingEdge = isRemovingNode = isRemovingEdge = false;
});

document.getElementById('addEdge').addEventListener('click', () => {
    isAddingEdge = true;
    isAddingNode = isRemovingNode = isRemovingEdge = false;
});

document.getElementById('removeNode').addEventListener('click', () => {
    isRemovingNode = true;
    isAddingNode = isAddingEdge = isRemovingEdge = false;
});

document.getElementById('removeEdge').addEventListener('click', () => {
    isRemovingEdge = true;
    isAddingNode = isAddingEdge = isRemovingNode = false;
});

// Canvas interaction
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
                const weight = prompt("Enter edge weight:", "1");
                addEdge(selectedNodes[0], selectedNodes[1], weight || 1);
                selectedNodes = [];
            }
        } else {
            selectedNodes = [];
        }
    } else if (isRemovingNode) {
        removeNode(x, y);
    } else if (isRemovingEdge) {
        removeEdge(x, y);
    }
});

// Canvas color change
document.querySelectorAll('.dropdown-content a[data-color]').forEach(link => {
    link.addEventListener('click', (event) => {
        const color = event.target.getAttribute('data-color');
        canvas.style.backgroundColor = color;
    });
});

// Algorithm logic (example BFS)
function bfsAlgorithm(startNode) {
    let visited = new Set();
    let queue = [startNode];
    let steps = [];

    while (queue.length > 0) {
        let current = queue.shift();
        if (!visited.has(current)) {
            visited.add(current);
            steps.push(current);

            // Get neighbors
            let neighbors = edges.filter(edge => edge.startNode === current || edge.endNode === current)
                                  .map(edge => edge.startNode === current ? edge.endNode : edge.startNode);
            
            neighbors.forEach(neighbor => {
                if (!visited.has(neighbor)) queue.push(neighbor);
            });
        }
    }
    return steps;
}

// Handle algorithm selection and visualization
document.getElementById('algorithmSelector').addEventListener('change', (event) => {
    selectedAlgorithm = event.target.value;
});

document.getElementById('visualizeButton').addEventListener('click', () => {
    if (isVisualizing) return;

    isVisualizing = true;
    currentStep = 0;
    const startNode = nodes[0];
    
    if (selectedAlgorithm === 'bfs') {
        traversalSteps = bfsAlgorithm(startNode);
    }

    animateVisualization();
});

function animateVisualization() {
    if (currentStep < traversalSteps.length) {
        const node = traversalSteps[currentStep];
        node.color = 'red';
        refreshCanvas();
        currentStep++;
        requestAnimationFrame(animateVisualization);
    } else {
        isVisualizing = false;
    }
}

// Fetch data from backend
async function fetchNodes() {
    const response = await fetch('/api/graph/nodes');
    return response.json();
}

async function fetchEdges() {
    const response = await fetch('/api/graph/edges');
    return response.json();
}

// Render graph with D3.js
async function renderGraph() {
    const nodes = await fetchNodes();
    const edges = await fetchEdges();

    const svg = d3.select("#graph").append("svg")
        .attr("width", 500)
        .attr("height", 500);

    nodes.forEach(node => {
        svg.append("circle")
            .attr("cx", Math.random() * 500)
            .attr("cy", Math.random() * 500)
            .attr("r", 20)
            .attr("fill", "blue")
            .append("title")
            .text(node.data);
    });

    edges.forEach(edge => {
        svg.append("line")
            .attr("x1", Math.random() * 500)
            .attr("y1", Math.random() * 500)
            .attr("x2", Math.random() * 500)
            .attr("y2", Math.random() * 500)
            .attr("stroke", "black")
            .attr("stroke-width", 2);
    });
}

renderGraph();
function dijkstraAlgorithm(startNode) {
    let distances = {};
    let prev = {};
    let pq = new PriorityQueue((a, b) => distances[a] < distances[b]);

    nodes.forEach(node => {
        distances[node.number] = Infinity;
        prev[node.number] = null;
    });
    distances[startNode.number] = 0;
    pq.enqueue(startNode.number);

    while (!pq.isEmpty()) {
        let currentNode = pq.dequeue();
        nodes[currentNode].color = 'yellow';  // Highlighting visited nodes
        refreshCanvas();

        edges.forEach(edge => {
            if (edge.startNode.number === currentNode || edge.endNode.number === currentNode) {
                let neighbor = (edge.startNode.number === currentNode) ? edge.endNode : edge.startNode;
                let alt = distances[currentNode] + edge.weight;
                if (alt < distances[neighbor.number]) {
                    distances[neighbor.number] = alt;
                    prev[neighbor.number] = currentNode;
                    pq.enqueue(neighbor.number);
                }
            }
        });
    }

    // Path backtracking
    return { distances, prev };
}
