# React Component Patterns

by Damian Senn

---

# Sketch:

## Anti Patterns

- Components with too many responsibilities
  - List taking in json instead of having independent list item components
  - Overconfiguration instead of composition
  - Passing too restrictive types (string instead of reactnode)
  - "God" Components, lots of logic and layout and styling

## Patterns

- Controlled / Uncontrolled
- Open (Radix/Ark) / Closed (Usually in Apps)
- Higher Order Component
- Render Props
- Compound Components with context
  - Root node with context provider
    - Give access to context via hook and MyComponent.Context component
- Headless Components
  - as={Component} (StyledComponents)
  - asChild (Ark, Radix, ...)
  - Slotted (Radix)
- Custom Hooks
  - Scalability issues (too many independent states)
    - Reducers
    - State Machines

---

# Agenda

- Introduction
- Open vs Closed Components
- How to build Open Components
- Conclusion and Recommendations
- Questions

---

## Who am I?

- Started in February last year
- Frontend Engineer
- Currently working on A11y for TBS
- Pet Dad of a dog and two cats
- Please ask questions right away or at the end of the presentation :)
