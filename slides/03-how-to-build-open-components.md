# How to build Open Components

---

- Start with logic in custom hooks
  - Internal implementation using hooks, reducers or state machines
  - exposing getters for props for each element, getItemProps etc.
  - have the getters merge any incoming props with the returned props
  - represent states with appropriate aria- attributes or alternatively data-
    attributes.
  - allow controlled states to be uncontrolled (open/value/etc.)
  - compose event handlers and allow preventDefault to cancel the
    implementations default behavior

---

- Create components for each individual "part" / element
- Allow each component to overwrite their rendered element (ala Radix `asChild`)
- Use context provider(s) within the Root node to pass down the exposed API
  (state, props getters, imperative functions like state setters, event handlers,
  etc.) by the hook.
  - Split into at least two providers
    1. That never or rarely changes (eg. event dispatchers, state setters)
    2. That changes frequently (eg. state)
