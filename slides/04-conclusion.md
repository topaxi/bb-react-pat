## Recap Open vs Closed Components

- Closed components encapsulate everything
  - State
  - Behavior
  - Layout and style
- Open components let you compose everything
  - Controlled and uncontrolled state
  - Reusable hooks
  - Slots
  - Render props

---

# Conclusion

---

#### Closed Components

- Great for reusability, as long as the amount of configurability / props is low <!-- .element: data-marker="✓" -->
- Unavoidable, most of your app code will be closed components <!-- .element: data-marker="✓" -->
- Hard to extend and generalize <!-- .element: data-marker="✕" -->
- Becode quickly overconfigurable "God" components with too many props <!-- .element: data-marker="✕" -->
- Harder to keep backwards compatible when requirements change <!-- .element: data-marker="✕" -->
- Tough call when to split and duplicate code <!-- .element: data-marker="✕" -->

---

#### Open Components

- Easier to add new features and behavior <!-- .element: data-marker="✓" -->
- Easier to reuse and adapt for specific use cases <!-- .element: data-marker="✓" -->
- Ark, Radix or shadcn/ui bring great open components out of the box <!-- .element: data-marker="✓" -->
- More initial effort in design and implementation <!-- .element: data-marker="✕" -->
- Hard to anticipate and cover all use cases in tests <!-- .element: data-marker="✕" -->
- Less useful for application code, like routes, pages, forms, … <!-- .element: data-marker="✕" -->
- Shareable components (eg. ContactBox) should probably be wrapped in a closed
  component anyway <!-- .element: data-marker="✕" -->

---

## Recommendations

1. Separate app components (closed) from design system components (open)

   - Different module or folder, eg.
     - `src/ui/components/**`
     - `src/app/components/**`

---

## Recommendations

2. As your design system grows, separate into module within monorepo.

   - Move app into a package:<br>`app/src/components/**`
   - Move design-system into a package:<br>`packages/ui/src/components/**`

3. In case of multiple apps consuming the same design-system, it might be
   desirable to move it into its own repository.
