import requests
import json

def test_backend():
    """Test the Python chatbot backend"""
    
    # Test health endpoint
    print("Testing health endpoint...")
    try:
        response = requests.get('http://localhost:5000/health')
        if response.status_code == 200:
            print("✓ Health check passed")
            print(f"  Response: {response.json()}")
        else:
            print(f"✗ Health check failed with status {response.status_code}")
    except Exception as e:
        print(f"✗ Health check failed with error: {e}")
    
    # Test chat endpoint
    print("\nTesting chat endpoint...")
    try:
        test_message = "Tell me about my players"
        response = requests.post('http://localhost:5000/api/chat', 
                                json={"message": test_message, "context": {}})
        if response.status_code == 200:
            print("✓ Chat endpoint passed")
            data = response.json()
            print(f"  Message: {test_message}")
            print(f"  Response: {data['response']}")
            print(f"  Intent: {data.get('intent', 'N/A')}")
        else:
            print(f"✗ Chat endpoint failed with status {response.status_code}")
            print(f"  Response: {response.text}")
    except Exception as e:
        print(f"✗ Chat endpoint failed with error: {e}")
    
    # Test team data endpoint
    print("\nTesting team data endpoint...")
    try:
        response = requests.get('http://localhost:5000/api/team-data')
        if response.status_code == 200:
            print("✓ Team data endpoint passed")
            data = response.json()
            print(f"  Players: {len(data.get('players', []))}")
            print(f"  Team name: {data.get('team', {}).get('name', 'N/A')}")
        else:
            print(f"✗ Team data endpoint failed with status {response.status_code}")
    except Exception as e:
        print(f"✗ Team data endpoint failed with error: {e}")

if __name__ == "__main__":
    test_backend()