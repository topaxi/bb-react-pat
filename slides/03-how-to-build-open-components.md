# How to build

# (more complex)

# Open Components

---

## Example Accordion

---

### Example Accordion Spec

- Collapsible panes
- Only a single pane can be open
- An event is called when a pane is selected (opened)

---

### Some helpers first!

```tsx [1-9|2-8|3|5-7|11-24|12-16|18-23|26-38|27|28|29|31-35|37]
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

## useAccordion()

- Start headless, with a hook
  - manages state
  - returns props and event handlers for elements

---

## useAccordion() Interfaces

```tsx [1-3|5-9|10-24|11|13-23]
interface UseAccordionItem {
  readonly value: string | number;
}

interface UseAccordionProps<Item extends UseAccordionItem> {
  items: readonly Item[];
  selected?: Item;
  defaultSelected?: Item;
  onSelect?: (event: React.SyntheticEvent, item: Item) => unknown;
}

interface UseAccordion<Item extends UseAccordionItem> {
  selected: Item | null;

  getContainerProps: (props: React.HTMLAttributes) => React.HTMLAttributes;
  getItemProps: (
    item: Item,
    props: React.HTMLAttributes,
  ) => React.HTMLAttributes;
  getItemTriggerProps: (
    item: Item,
    props: React.HTMLAttributes,
  ) => React.HTMLAttributes;
}
```

---

## useAccordion()

```tsx
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
    [setSelected],
  );

  return useMemo(
    () => ({
      selected: selected ?? null,
      getContainerProps(props) {
        return { id };
      },
      getItemProps(item, props) {
        return {
          id: `${id}-item`,
          "data-state": selected.value === item.value ? "open" : "closed",
          ...props,
        };
      },
      getItemTriggerProps(item, props) {
        return {
          id: `${id}-trigger`,
          "aria-controls": `${id}-item`,
          "aria-expanded": selected.value === item.value,
          ...props,
          onClick: composeEventHandlers(props.onClick, handleSelect(item)),
        };
      },
    }),
    [open, onSelect],
  );
}
```

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
