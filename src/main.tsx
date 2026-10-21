import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Protect React DOM reconciliation from browser translation (Chrome/Edge Translate)
// and third-party extensions that wrap or reparent text nodes (<font>, etc.),
// preventing "Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node."
if (typeof Node === "function" && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(child: T): T {
    if (child && child.parentNode !== this) {
      try {
        if (child.parentNode && this.contains(child.parentNode)) {
          let wrapper: Node | null = child.parentNode;
          while (wrapper && wrapper.parentNode !== this) {
            wrapper = wrapper.parentNode;
          }
          if (wrapper && wrapper.parentNode === this) {
            originalRemoveChild.call(this, wrapper);
          } else {
            child.parentNode.removeChild(child);
          }
        }
      } catch {
        // Ignore if already detached
      }
      return child;
    }
    return originalRemoveChild.apply(this, arguments as unknown as [Node]) as T;
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(
    newNode: T,
    referenceNode: Node | null
  ): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      try {
        if (referenceNode.parentNode && this.contains(referenceNode.parentNode)) {
          let wrapper: Node | null = referenceNode.parentNode;
          while (wrapper && wrapper.parentNode !== this) {
            wrapper = wrapper.parentNode;
          }
          if (wrapper && wrapper.parentNode === this) {
            return originalInsertBefore.call(this, newNode, wrapper) as T;
          }
        }
        return originalInsertBefore.call(this, newNode, null) as T;
      } catch {
        return newNode;
      }
    }
    return originalInsertBefore.apply(
      this,
      arguments as unknown as [Node, Node | null]
    ) as T;
  };
}

createRoot(document.getElementById("root")!).render(<App />);
