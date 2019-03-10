
# Sites Reader

Sites Reader is TypeScript Node.js module that recursively looks through thousands of web pages and it's html content to find an id in each page and save every matching content in an easy to use json format, it looks through the specified html element and pulls out it's text content to an object that contains the text's parent class, id, styles and other attributes, then add this object to the results array, thus converting a recursive html element to simple text object array

  

**Function:**

- looks through thousands of webpages based on URL query function as a parameter, and stops when the function throws `"end it"` string

- parse the the html content and find the specified id in the html file for save

- returns a CustomHTMLObjectArray with refrences of each url used to generate this object

- can save the original html text for each match

  

[Project page](https://github.com/MoustafaMohsen/sites-reader)

  

## How to use

look at the example in [index.ts](/src/index.ts)


## Contributing

  

1. Fork it!

2. Create your feature branch: `git checkout -b my-new-feature`

3. Commit your changes: `git commit -am 'Add some feature'`

4. Push to the branch: `git push origin my-new-feature`

5. Submit a pull request :D

  

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

  

## Versioning

  

We use [SemVer](http://semver.org/) for versioning

  

## Authors

  

*  **Moustafa Mohsen** - *Creator* - [moustafamohsen.com](https://moustafamohsen.com)

  
  

## License

  

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details