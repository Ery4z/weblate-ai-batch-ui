import requests

class TranslationAPIWrapper:
    def __init__(self, base_url, api_key=None):
        self.base_url = base_url
        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}" if api_key else None
        }

    def get_units(self, query=None):
        """Retrieve a list of translation units. You can pass a search query string to filter the results."""
        params = {'q': query} if query else {}
        response = requests.get(f"{self.base_url}/units/", headers=self.headers, params=params)
        return self._handle_response(response)

    def get_unit(self, unit_id):
        """Retrieve a specific translation unit by its ID."""
        response = requests.get(f"{self.base_url}/units/{unit_id}/", headers=self.headers)
        return self._handle_response(response)

    def search_units(self, search_string):
        """Search for a specific string in the translation units."""
        params = {'q': search_string}
        response = requests.get(f"{self.base_url}/units/", headers=self.headers, params=params)
        return self._handle_response(response)

    def update_unit(self, unit_id, data):
        """Partially update a translation unit."""
        response = requests.patch(f"{self.base_url}/units/{unit_id}/", headers=self.headers, json=data)
        return self._handle_response(response)

    def replace_unit(self, unit_id, data):
        """Completely update a translation unit."""
        response = requests.put(f"{self.base_url}/units/{unit_id}/", headers=self.headers, json=data)
        return self._handle_response(response)

    def delete_unit(self, unit_id):
        """Delete a specific translation unit."""
        response = requests.delete(f"{self.base_url}/units/{unit_id}/", headers=self.headers)
        return self._handle_response(response)

    def _handle_response(self, response):
        """Handle the API response and raise an error if needed."""
        if response.status_code in (200, 201):
            return response.json()
        elif response.status_code == 204:
            return {"message": "Deleted successfully"}
        else:
            response.raise_for_status()

# Example usage:
# api = TranslationAPIWrapper(base_url="https://example.com/api", api_key="your_api_key")
# search_results = api.search_units(search_string="hello world")
# print(search_results)

if __name__ == "__main__":
    import json
    api = TranslationAPIWrapper(base_url="https://hosted.weblate.org/api/", api_key="wlu_qN9QYKVPJa5avxui7YZmQcPjhs4mAjrOi4LO")
    search_results = api.search_units(search_string="boards.movingImagesToBoard")
    with open("output.json", "w") as f:
        json.dump(search_results, f, indent=4)