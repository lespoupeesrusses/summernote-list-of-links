# Summernote List Of Links

[![Maintainability](https://api.codeclimate.com/v1/badges/7cd29f1577d8c2fb3da1/maintainability)](https://codeclimate.com/github/lespoupeesrusses/summernote-list-of-links/maintainability)

This plugin adds a button to let you choose from an external list of links, provided as json.

## Usage

    $(document).ready(function() {
        $('#summernote').summernote({
            height: 300,
            toolbar: [
                ['style', ['bold', 'italic', 'underline', 'link', 'list-of-links', 'codeview']]
            ],
            listOfLinks: {
              listUrl: 'data.json'
            }
        });
    });

/data.json

    [
      ["http://www.google.fr", "Google"],
      ["http://www.facebook.com", "Facebook"]
    ]

## Credits

Example copied from https://github.com/tylerecouture/summernote-add-text-tags