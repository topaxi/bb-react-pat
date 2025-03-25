# Open vs Closed Components

---

## Open vs Closed Components

Closed Component

```tsx
function PetList({ pets }) {
  return (
    <ul>
      {pets.map((pet) => (
        <li key={pet.id}>{pet.type} {pet.name}</li>
      )}
    </ul>
  )
}
```

NOTE: Show what happens when you want to customize anything with a closed
component.
