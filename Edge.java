public class Edge<E> {
    private E data;
    private Node head;
    private Node tail;

    public Edge(E data, Node head, Node tail) {
        this.data = data;
        this.head = head;
        this.tail = tail;
    }

    public E getData() {
        return data;
    }

    public Node getHead() {
        return head;
    }

    public Node getTail() {
        return tail;
    }
}
