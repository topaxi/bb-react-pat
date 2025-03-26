# Open Components

# vs

# Closed Components

---

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

## Example

```json
{
  "pets": [
    { "id": 1, "type": "Dog", "name": "Upsi" },
    { "id": 2, "type": "Cat", "name": "Lou" },
    { "id": 3, "type": "Cat", "name": "Winston" }
  ]
}
```

---

## Closed Component Example

```tsx
const ICONS = { Cat: "🐈", Dog: "🐕" };

function PetList({ pets }) {
  return (
    <ul className="pet-list">
      {pets.map(pet => (
        <li className="pet-list__item" key={pet.id}>
          <i className="pet-list__item-icon">{ICONS[pet.type]}</i>
          {pet.name}
        </li>
      )}
    </ul>
  )
}
```

---

## Make it stylable!

```tsx [1|3,5]
function PetList({ className, itemClassName, pets }) {
  return (
    <ul className={`pet-list ${className}`}>
      {pets.map(pet => (
        <li className={`pet-list__item ${itemClassName}`} key={pet.id}>
          <i className="pet-list__item-icon">{ICONS[pet.type]}</i>
          {pet.name}
        </li>
      )}
    </ul>
  )
}
```

---

## Make it interactive!

```tsx [1|6-19]
function PetList({ href, onItemClick, className, itemClassName, pets }) {
  return (
    <ul className={`pet-list ${className}`}>
      {pets.map(pet => (
        <li className={`pet-list__item ${itemClassName}`} key={pet.id}>
          {onItemClick ?
            <button onItemClick={onItemClick}>
              <i className="pet-list__item-icon">{ICONS[pet.type]}</i>
              {pet.name}
            </button> :
            href ?
              <a href={href}>
                <i className="pet-list__item-icon">{ICONS[pet.type]}</i>
                {pet.name}
              </a> :
            <>
              <i className="pet-list__item-icon">{ICONS[pet.type]}</i>
              {pet.name}
            <>}
        </li>
      )}
    </ul>
  )
}
```

---

## Refactor duplicated code!

```tsx [1|5-8,12-15]
function PetList({ href, onItemClick, className, itemClassName, pets }) {
  return (
    <ul className={className}>
      {pets.map(pet => {
        let content = <>
          <i className="pet-list__item-icon">{ICONS[pet.type]}</i>
          {pet.name}
        <>;

        return (
          <li key={pet.id} className={itemClassName}>
            {onItemClick ?
              <button onItemClick={onItemClick}>{content}</button> :
              href ? <a href={href}>{content}</a> :
              content}
          </li>
        )
      }}
    </ul>
  )
}
```

---

## Requirements change!

- The link should open in a new tab
  - Add further "target" props or replace "href" prop with an options object
  - Use the `onItemClick` prop instead and imperatively open a link
- The contents should be customizable
  - I don't always want to see the `pet.type`
  - I want to have a list where I see the pets favorite food

---

## Extending Closed Component

- Increased complexity within component
- Ever increasing props and props drilling
- Harded to reason about from call site
- Can be great for reusability, when low in configurability

---

## Open Component Example

Identify generic pattern

```tsx
function List({ className, ...props }) {
  return <ul {...props} className={`my-list ${className}`} />;
}

function ListItem({ className, ...props }) {
  return <li {...props} className={`my-list__item ${className}`} />;
}
```

---

## Implement specific use-case

- Provide overridable default behavior
- Here we infer icons based on type, but let the developer overwrite or remove the icon.

```tsx
function PetList({ className, ...props }) {
  return <List {...props} className={`pet-list ${className}`} />;
}

const ICONS = { Cat: "🐈", Dog: "🐕" };

function PetListItem(props) {
  const { className, type, icon = ICONS[type], ...rest } = props;
  return (
    <ListItem {...rest} className={`pet-list__item ${className}`}>
      {icon && <i className="pet-list__item-icon">{icon}</i>}
      {rest.children}
    </ListItem>
  );
}
```

---

## Using the Open Component

```tsx
function PetSummaryListPage({ pets }) {
  return (
    <PetList>
      {pets.map(pet => (
        <ListItem type={pet.type} key={pet.id}>
          {pet.name}
        </ListItem>
      )}
    </List>
  )
}
```

---

## Customize Open Component

```tsx
function PetSummaryListPage({ pets }) {
  return (
    <PetList className="pet-summary-list">
      {pets.map(pet => (
        <PetListItem type={pet.type} className="pet-summary-list" key={pet.id}>
          <a href={`/pets/${pet.id}`}>
            {pet.name}
          </a>
        </PetListItem>
      )}
    </PetList>
  )
}
```

---

## Requirements change!

- The link should open in a new tab
- The contents should be customizable

```tsx [5-18]
function PetFoodListPage({ pets }) {
  return (
    <PetList className="pet-food-list">
      {pets.map(pet => (
        <PetListItem type={pet.type} className="pet-food-list__item" key={pet.id}>
          <h3 className="pet-food-list__item_title">
            <a href={`/pets/${pet.id}`} target="_blank" rel="noopener">
              {pet.name}
            </a>
            <span>favorite foods</span>
          </h3>

          <ul className="pet-food-list__favorite-food-list">
            {pet.food.filter(f => f.isFavorite).map(food =>
              <li key={food.id}>{food.name}</li>
            )}
          </ul>
        </PetListItem>
      )}
    </PetList>
  )
}
```

---

## Extending Open Component

- Complexity kept low on the components
- Increased complexity on usage
- Potentially duplicated code
- Element structure resembles data structure
- Always possible to wrap / repackage in a closed component
  - In fact, the `PetSummaryListPage` and `PetFoodListPage` were closed
    components.

---

## Open vs Closed Components

- Closed components encapsulate everything
  - State
  - Behavior
  - Layout and style
- Open components let you compose everything
  - Reusable hooks
  - Slots
  - Render props
