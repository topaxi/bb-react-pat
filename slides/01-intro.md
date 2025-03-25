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

## Recommendations

- In growing apps
  - Separate app components (closed) from design system components (open)
    - Different module or folder, eg.
      - src/app/components
      - src/ui/components
    - Monorepo
    - Separate repository in case of multiple projects consuming the design
      system.

## Not today (not this presentation)

- "Prop drilling"
- Managing derived state
- No effect cleanups
- Effects with too many responsibilities
- Boolean props or states
  - instead of enums / union types
  - instead of composition
- Impure Components
  - new Date() / Date.now()
  - Math.random()
  - Generating ids (for example uuid)
- Storing too much in context
  - Causes unnecessary rerender of all consumers
    - Split into multiple contexts, one using actions/methods one using
      state. Or split state which frequently changes and state which rarely
      changes into their own context.

---

# Agenda

- Introduction
- Open vs Closed Components
- How to build Open Components
- Questions

---

## Who am I?

- Started in February last year
- Frontend Engineer
- Currently working on A11y for TBS
- Pet Dad of a dog and two cats
- Please ask questions right away or at the end of the presentation :)
