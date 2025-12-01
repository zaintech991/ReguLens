# Backend Installation Troubleshooting

## Python 3.13 Compatibility Issues

If you encounter errors building `pydantic-core` with Python 3.13, try one of these solutions:

### Solution 1: Use Python 3.11 or 3.12 (Recommended)

Python 3.11 and 3.12 have better compatibility with the current package ecosystem.

```bash
# Check your Python version
python --version

# If you have Python 3.11 or 3.12 installed, use it:
python3.11 -m venv venv
# or
python3.12 -m venv venv

# Then activate and install
source venv/bin/activate
pip install -r requirements.txt
```

### Solution 2: Use Pre-built Wheels

If you must use Python 3.13, try installing with pre-built wheels:

```bash
pip install --only-binary :all: -r requirements.txt
```

### Solution 3: Upgrade pip and setuptools

Sometimes upgrading build tools helps:

```bash
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
```

### Solution 4: Install Rust (if building from source)

If you need to build from source, you'll need Rust:

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Then try installing again
pip install -r requirements.txt
```

## Common Issues

### Issue: "Failed building wheel for pydantic-core"

**Solution**: Use Python 3.11 or 3.12, or wait for pre-built wheels for Python 3.13.

### Issue: "Rust not found"

**Solution**: Install Rust (see Solution 4 above) or use Python 3.11/3.12 with pre-built wheels.

### Issue: Import errors after installation

**Solution**: Make sure you're in the virtual environment:
```bash
source venv/bin/activate
```

### Issue: Port already in use

**Solution**: Use a different port:
```bash
uvicorn app.main:app --reload --port 8001
```

