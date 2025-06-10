import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/graph")
public class GraphController {

    private Graph<String, Integer> graph = new Graph<>();

    @PostMapping("/node")
    public Node addNode(@RequestParam String data) {
        return graph.addNode(data);
    }

    @PostMapping("/edge")
    public Edge addEdge(@RequestParam String head, @RequestParam String tail, @RequestParam Integer weight) {
        Node headNode = findNode(head);
        Node tailNode = findNode(tail);
        return graph.addEdge(weight, headNode, tailNode);
    }

    @GetMapping("/nodes")
    public List<Node> getNodes() {
        return graph.getNodes();
    }

    @GetMapping("/edges")
    public List<Edge> getEdges() {
        return graph.getEdges();
    }

    private Node findNode(String data) {
        return graph.getNodes().stream()
            .filter(node -> node.getData().equals(data))
            .findFirst()
            .orElse(null);
    }
}
