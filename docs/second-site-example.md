# Second Site Example

1. Add the module import to `config/_default/module.yaml`.
2. Add a `Library` menu item pointing to `/paper-library`.
3. Ensure GitHub Actions builds with Go available for Hugo Modules.
4. Trigger rebuilds from `shared-paper-library` with `repository_dispatch`.

The second site does not need its own copy of:

- paper content
- citation JSON
- statistics templates
- graph assets

It only needs to import the module and rebuild when the shared repository changes.
