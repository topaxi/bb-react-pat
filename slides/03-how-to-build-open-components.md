
How to build

# (more complex)

# Open Components

---

## Let's build an Accordion

---

### Example Accordion Spec

- Collapsible panes
- Only a single pane can be open
- An event is called when a pane is selected (opened)

---

### Some helpers first!

```tsx [2-9|2-8|3|5-7|11-24|12-16|18-23|26-38|27|28|29|31-35|37]
export function composeEventHandlers(providedEventHandler, ourEventHandler) {
  return function wrappedEventHandler(event) {
    providedEventHandler?.(event);

    if (!event.defaultPrevented) {
      return ourEventHandler?.(event);
    }
  };
}

export function useCallbackRef(callback) {
  let callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  return useMemo(
    () =>
      (...args) =>
        callbackRef.current?.(...args),
    [],
  );
}

export function useControlledState(controlledValue, defaultValue) {
  let [internalValue, setInternalValue] = useState(defaultValue);
  let isControlled = controlledValue !== undefined;
  let value = isControlled ? controlledValue : internalValue;

  let setValue = useCallbackRef((newValue) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
  });

  return [value, setValue];
}
```

---

### Some helpers first!

- `composeEventHandlers`<br>
  to let developers pass in their own behavior and potentially prevent the default implementation
- `useCallbackRef`<br>
  to have stable references to event handlers, which avoids
  unnecessary rerenders
- `useControlledState`<br>
  to optionally control components state from the outside

---

## useAccordion()

- Start headless, with a hook
  - manages state
  - sets up event handlers
  - returns props and event handlers for elements

---

## useAccordion() Interfaces

```tsx [1-3|5-10|12-15|16-31|18|19-22|23-26|27-30|33-35]
interface UseAccordionItem {
  readonly value: string | number;
}

interface UseAccordionProps<Item extends UseAccordionItem> {
  items: readonly Item[];
  selected?: Item;
  defaultSelected?: Item;
  onSelect?: (event: React.SyntheticEvent, item: Item) => unknown;
}

interface UseAccordionState<Item extends UseAccordionItem> {
  items: readonly Item[];
  selected: Item | null;
}

interface UseAccordionApi<Item extends UseAccordionItem> {
  getContainerProps: (props: React.HTMLAttributes) => React.HTMLAttributes;
  getItemProps: (
    item: Item,
    props: React.HTMLAttributes,
  ) => React.HTMLAttributes;
  getItemTriggerProps: (
    item: Item,
    props: React.HTMLAttributes,
  ) => React.HTMLAttributes;
  getItemContentProps: (
    item: Item,
    props: React.HTMLAttributes,
  ) => React.HTMLAttributes;
}

interface UseAccordion<Item extends UseAccordionItem>
  extends UseAccordionState<Item>,
    UseAccordionApi<Item> {}







// padded to center last focused lines
```

---

## useAccordion()

```tsx [|2-3|5-8|10|12-20|19|22|60|24|26-28|29-37|38-49|44-47|50-58]
function useAccordion<T>(props: UseAccordionProps<T>): UseAccordion<T> {
  let autoId = useId();
  let id = props.id || autoId;

  let [selected, setSelected] = useControlledState(
    props.selected,
    props.defaultSelected,
  );

  let onSelect = useCallbackRef(props.onSelect);

  let handleSelect = useCallback(
    (item) => {
      return (_event) => {
        setSelected(item);
        onSelect(item);
      };
    },
    [setSelected, onSelect],
  );

  return useMemo(
    () => ({
      selected: selected ?? null,

      getContainerProps(props) {
        return { id };
      },
      getItemProps(item, props) {
        return {
          id: `${id}:item`,
          "data-state": selected.value === item.value ?
            "open" :
            "closed",
          ...props,
        };
      },
      getItemTriggerProps(item, props) {
        return {
          id: `${id}:trigger`,
          "aria-controls": `${id}:item`,
          "aria-expanded": selected.value === item.value,
          ...props,
          onClick: composeEventHandlers(
            props.onClick,
            handleSelect(item)
          ),
        };
      },
      getItemContentProps(item, props) {
        return {
          id: `${id}:content`,
          "data-state": selected.value === item.value ?
            "open" :
            "closed",
          ...props,
        };
      },
    }),
    [id, selected, onSelect, handleSelect],
  );
}
```

---

### useAccordion() Summary

- Internal implementation using state, reducers or state machines
- Allow controlled states to be uncontrolled
- Expose getters for props for each element
- Getters should merge incoming props with the returned props
- Represent states with `aria-` or `data-` attributes
- Compose event handlers and allow preventDefault to cancel the
  implementations default behavior

---

## Accordion Context

---

- Separate context values which change frequently and which change rarely.<br><small>(Does not fully apply in this example, as API always changes based on selected)</small>

```tsx [1-10|12-23]
export const AccordionStateContext =
  createContext<UseAccordionState<unknown>>({
    selected: null,
  });

export const AccordionApiContext =
  createContext<UseAccordionApi<unknown> | null>(null);

export const AccordionItemContext =
  createContext<unknown>(null);

export const useAccordionState =
  () => useContext(AccordionStateContext);

export const useAccordionApi = () => {
  let api = useContext(AccordionApiContext);
  if (api == null)
    throw new Error('Must be used within Accordion.Root');
  return api;
}

export const useAccordionItemContext =
  () => useContext(AccordionItemContext)


```

---

## Accordion Elements

```tsx [1-6|6-14|16-17|20-21,26-27|22-25|31-35|35-40|42-49|52-62|64-73|76-79]
interface AccordionContainerProps<T>
  extends
    React.HTMLAttributes<HTMLDivElement>,
    UseAccordionProps<T> {}

function AccordionContainer<T>(props: AccordionContainerProps<T>) {
  let {
    items,
    selected,
    defaultSelected,
    onSelect,
    className,
    ...rest
  } = props;

  let { selected, ...api } =
    useAccordion({ items, selected, defaultSelected, onSelect });

  return (
    <AccordionApiContext.Provider value={api}>
      <AccordionStateContext.Provider value={{ selected }}>
        <div
          className={`my-accordion ${className}`}
          {...api.getContainerProps(rest)}
        />
      </AccordionStateContext.Provider>
    </AccordionApiContext.Provider>
  );
}

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | number;
}

function AccordionItem({ value, ...rest }) {
  let api = useAccordionApi();
  let item = useMemo(
    () => api.items.find(item => item.value == value),
    [value, api.items]
  );

  return (
    <AccordionItemContext value={item}>
      <div
        {...api.getItemProps(item, rest)}
        className={`my-accordion__item ${rest.className}`}
      />
    </AccordionItemContext>
  );
}

interface AccordionItemTrigger(props) {
  let api = useAccordionApi();
  let item = useAccordionItem();

  return (
    <button
      {...api.getItemTriggerProps(item, props)}
      className={`my-accordion__item-trigger ${props.className}`}
    />
  );
}

function AccordionItemContent() {
  let api = useAccordionApi();
  let item = useAccordionItem();

  return (
    <div
      {...api.getItemContentProps(item, props)}
      className={`my-accordion__item-content ${props.className}`}
    />
  );
}

export const Root = AccordionContainer;
export const Item = AccordionItem;
export const ItemTrigger = AccordionItemTrigger;
export const ItemContent = AccordionItemContent;




```

---

## Usage of Accordion

```tsx [|1|3-7|10|11|12-28|13-17|18-27]
import * as Accordion from './accordion';

function PetDetails({ pets }) {
  let items = useMemo(
    () => pets.map(pet => ({ value: pet.id, pet })),
    [pets],
  );

  return (
    <Accordion.Root items={items}>
      {items.map(({ value, pet }) => (
        <Accordion.Item key={value} value={value}>
          <h3>
            <Accordion.ItemTrigger>
              {pet.name}
            </Accordion.ItemTrigger>
          </h3>
          <AccordionItem.Content>
            <ul>
              {pet.foods.map(f => (
                <li key={f.id}>
                  {f.isFavorite ? '❤️' : '😐'}
                  {f.name}
                </li>
              ))}
            </ul>
          </AccordionItem.Content>
        </Accordion.Item>
      ));
    </Accordion.Root>
  );
}
```

---

### Further potential improvements

- Let the accordion items register themselves on the container
- Allow elements of components to be overwritten
  - Ark or Radix use an `asChild` prop
  - Radix also offers slots
  - StyledComponents use `as` prop

---

### Accordion Component Summary

- Create components for each individual "part" / element
- Use context provider(s) within the Root node to pass down the exposed API
  (state, props getters, imperative functions like state setters, event handlers,
  etc.) by the hook.
  - Split into at least two providers
    1. That never or rarely changes (eg. event dispatchers, state setters)
    2. That changes frequently (eg. state)
