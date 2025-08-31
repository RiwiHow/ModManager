venv_activate := if os() == 'windows' {
  './backend/.venv/Scripts/activate'
} else {
  './backend/.venv/bin/activate'
}

delete-dist:
  rm -rf ./backend/dist
  rm -rf ./frontend/dist

dist-python:
    @source {{venv_activate}} && pyinstaller --distpath ./backend/dist --workpath ./backend/dist/build --specpath ./backend/dist/spec --onefile {{ if os() == "windows" { "--noconsole" } else { "" } }} ./backend/src/main.py

dist-vite:
    @cd ./frontend && bun run build

dist:
    just delete-dist
    just dist-python
    just dist-vite
    @cd ./frontend && bun run {{ if os() == "windows" { "dist:win" } else { "dist:mac" } }}