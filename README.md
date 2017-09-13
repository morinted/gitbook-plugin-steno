# Steno Gitbook Plugin

This is a set of convenience tools to display [steno](https://en.wikipedia.org/wiki/Stenotype)
material in a Gitbook. It is being written for use of figures and practice material for
[Plover Theory](https://www.gitbook.com/book/morinted/plover-theory/)

## Usage

### Layout Display

This is a block to summon a steno layout with optional chord and key labels.

```
{% stenodisplay labels="all" %}
KHORD
{% endstenodisplay %}
```

- labels can be omitted, "all", or anything in between, including pseudo steno like "GAOD" and "BAD".
- the body of the block is the chord that will be highlighted, also in pseudo steno.
