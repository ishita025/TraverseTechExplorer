import java.util.ArrayList;

public class Node<V> {
    private V data;
    private ArrayList<Edge> edgesOut;
    private ArrayList<Edge> edgesIn;

    public Node(V data) {
        this.data = data;
        edgesOut = new ArrayList<>();
        edgesIn = new ArrayList<>();
    }

    public V getData() {
        return data;
    }

    public ArrayList<Edge> getEdgesOut() {
        return edgesOut;
    }

    public ArrayList<Edge> getEdgesIn() {
        return edgesIn;
    }

    public void addEdgeOut(Edge edge) {
        edgesOut.add(edge);
    }

    public void addEdgeIn(Edge edge) {
        edgesIn.add(edge);
    }
}
