import java.util.*;

public class Graph<V, E extends Number> {  // E extends Number for weighted edges
    private List<Edge<E>> edges;
    private List<Node<V>> nodes;

    public Graph() {
        edges = new ArrayList<>();
        nodes = new ArrayList<>();
    }

    public Node<V> addNode(V data) {
        Node<V> newNode = new Node<>(data);
        nodes.add(newNode);
        return newNode;
    }

    public Edge<E> addEdge(E weight, Node<V> head, Node<V> tail) {
        Edge<E> newEdge = new Edge<>(weight, head, tail);
        head.addEdgeOut(newEdge);
        tail.addEdgeIn(newEdge);
        edges.add(newEdge);
        return newEdge;
    }

    public List<Node<V>> getNodes() {
        return nodes;
    }

    public List<Edge<E>> getEdges() {
        return edges;
    }

    // Dijkstra's Algorithm
    public Map<Node<V>, Double> dijkstra(Node<V> start) {
        Map<Node<V>, Double> distances = new HashMap<>();
        PriorityQueue<Node<V>> queue = new PriorityQueue<>(Comparator.comparing(distances::get));
        
        // Initialize distances to infinity, except for the start node
        for (Node<V> node : nodes) {
            distances.put(node, Double.POSITIVE_INFINITY);
        }
        distances.put(start, 0.0);
        queue.add(start);

        while (!queue.isEmpty()) {
            Node<V> current = queue.poll();

            for (Edge<E> edge : current.getEdgesOut()) {
                Node<V> neighbor = edge.getTail();
                double weight = edge.getData().doubleValue();
                double newDist = distances.get(current) + weight;

                // Update distance if a shorter path is found
                if (newDist < distances.get(neighbor)) {
                    distances.put(neighbor, newDist);
                    queue.add(neighbor);
                }
            }
        }
        return distances;
    }

    // Node class
    public static class Node<V> {
        private V data;
        private List<Edge<?>> edgesIn;
        private List<Edge<?>> edgesOut;

        public Node(V data) {
            this.data = data;
            edgesIn = new ArrayList<>();
            edgesOut = new ArrayList<>();
        }

        public V getData() {
            return data;
        }

        public List<Edge<?>> getEdgesIn() {
            return edgesIn;
        }

        public List<Edge<?>> getEdgesOut() {
            return edgesOut;
        }

        public void addEdgeIn(Edge<?> edge) {
            edgesIn.add(edge);
        }

        public void addEdgeOut(Edge<?> edge) {
            edgesOut.add(edge);
        }
    }

    // Edge class
    public static class Edge<E> {
        private E data;  // Represents the weight of the edge
        private Node<?> head;
        private Node<?> tail;

        public Edge(E data, Node<?> head, Node<?> tail) {
            this.data = data;
            this.head = head;
            this.tail = tail;
        }

        public E getData() {
            return data;
        }

        public Node<?> getHead() {
            return head;
        }

        public Node<?> getTail() {
            return tail;
        }
    }
}
