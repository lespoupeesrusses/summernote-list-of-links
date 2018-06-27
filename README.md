# Summernote List Of Links

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