# POG Task Manager - Developer Guide

This guide provides instructions for setting up, building, and packaging the POG Task Manager VS Code extension.

## 📂 Project Structure

The project follows a standard VS Code extension structure:

- **`src/`**: Source code directory.
    - **`commands/`**: Implementation of VS Code commands (e.g., `initPogTask`, `refreshTasks`).
    - **`core/`**: Core logic including `TaskStore`, `fsWatcher`, and data models.
    - **`ui/`**: UI components such as TreeViews and Webviews.
- **`package.json`**: Extension manifest, defining commands, views, and configuration.
- **`webpack.config.js`**: Configuration for bundling the extension.

## 🚀 Setup & Build

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1.  Navigate to the `pog-task-manager` directory:
    ```bash
    cd pog-task-manager
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Compilation

- **Compile (Production)**:
    ```bash
    npm run compile
    ```
- **Watch Mode (Development)**:
    ```bash
    npm run watch
    ```

## 📦 Packaging

We use `vsce` (Visual Studio Code Extensions) to package the extension.

### 1. Install `vsce`

If you haven't installed it globally:

```bash
npm install -g @vscode/vsce
```

### 2. Package the Extension

To create a `.vsix` file for installation or distribution:

```bash
vsce package
```

This command will:
1.  Run the `prepublish` script (which runs `npm run package`).
2.  Generate a file named `pog-task-manager-x.y.z.vsix` in the current directory.

### 3. Install locally

You can install the packaged `.vsix` file in VS Code:

```bash
code --install-extension pog-task-manager-1.1.0.vsix
```

## 🧪 Testing

To run the automated tests:

```bash
npm test
```
