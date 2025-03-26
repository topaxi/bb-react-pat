## Conclusion

#### Closed Components

- Great for reusability, as long as the amount of configurability / props is low <!-- .element: data-marker="✓" -->
- Unavoidable, most of your app code will be closed components <!-- .element: data-marker="✓" -->
- Hard to extend and generalize <!-- .element: data-marker="✕" -->
- Harder to keep backwards compatible when requirements change <!-- .element: data-marker="✕" -->

---

#### Open Components

- More initial effort in design and implementation <!-- .element: data-marker="✓" -->
- Easier to add new features and behavior <!-- .element: data-marker="✓" -->
- Ark, Radix or shadcn/ui bring great open components out of the box <!-- .element: data-marker="✓" -->
- Less useful for application code, like routes, pages, forms, … <!-- .element: data-marker="✕" -->

---

## Recommendations

- As your app grows:
  Separate app components (closed) from design system components (open)
  - Different module or folder, eg.
    - `src/ui/components/**`
    - `src/app/components/**`
