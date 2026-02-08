import os
import json
import sys
import subprocess

def install_dependencies():
    print("Checking dependencies...")
    try:
        import yaml
        import jsonschema
        print("Dependencies are already installed.")
    except ImportError:
        print("Missing dependencies. Installing PyYAML and jsonschema...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "PyYAML", "jsonschema"])
        print("Dependencies installed successfully.")

def validate_tasks():
    try:
        import yaml
        from jsonschema import validate, ValidationError
    except ImportError:
        print("Error: PyYAML and jsonschema are required.")
        print("Please run: pip install PyYAML jsonschema")
        return

    base_dir = os.path.dirname(os.path.abspath(__file__))
    list_dir = os.path.join(base_dir, "list")
    schema_path = os.path.join(base_dir, "task.schema.json")

    if not os.path.exists(schema_path):
        print(f"Error: Schema file not found at {schema_path}")
        return

    with open(schema_path, "r", encoding="utf-8") as f:
        schema = json.load(f)

    success_count = 0
    error_count = 0

    print(f"Validating YAML files in {list_dir}...")

    for root, dirs, files in os.walk(list_dir):
        for file in files:
            if file.endswith(".yaml"):
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, base_dir)
                
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        data = yaml.safe_load(f)
                    
                    if data is None:
                        continue
                        
                    validate(instance=data, schema=schema)
                    print(f"[OK] {relative_path}")
                    success_count += 1
                except yaml.YAMLError as e:
                    print(f"[YAML ERROR] {relative_path}: {e}")
                    error_count += 1
                except ValidationError as e:
                    print(f"[SCHEMA ERROR] {relative_path}: {e.message}")
                    error_count += 1
                except Exception as e:
                    print(f"[UNKNOWN ERROR] {relative_path}: {e}")
                    error_count += 1

    print("\nValidation Summary:")
    print(f"  Total Valid: {success_count}")
    print(f"  Total Errors: {error_count}")

    if error_count > 0:
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--install":
        install_dependencies()
    else:
        validate_tasks()
