const express = require('express')
const app = express();
const fs = require('fs');
const { promisify } = require('util')
const ejs = require('ejs');
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path');
const xss = require('xss-clean');

app.use(bodyParser.json())
app.use(cors());
app.use(xss());
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// app.get('/views/history.html', (req, res) => {
//   res.sendFile(__dirname + '/views/history.html');
// });

app.get('/logs', (req, res) => {
  const filePath = path.join(__dirname, 'views', 'logs.html');
  res.sendFile(filePath);
});




app.post('/create-subpage', async (req, res) => {
    try {
      const { name, phone, address, email, facebook, whatsapp, twitter, instagram, linkedin, image } = req.body;
      if (!name || !phone || !address || !email || !facebook || !whatsapp || !twitter || !instagram || !linkedin || !image ) {
        res.status(400).send('Name, Phone, Address, Email, Facebook, WhatsApp, Twitter, Instagram, LinkedIn, and Image are required');
      } else {
        // let filename = null;
        const timestamp = Date.now();
        let vcard = 'BEGIN:VCARD\nVERSION:3.0\nN:' + name + '\nTEL;TYPE=CELL:' + phone + '\nEMAIL:'+ email + '\nURL;TYPE=facebook:'+ facebook +'\nURL;TYPE=whatsapp:'+whatsapp+'\nURL;TYPE=twitter:'+twitter+'\nURL;TYPE=instagram:'+instagram+'\nURL;TYPE=linkedin:'+linkedin+'\nADR;TYPE=WORK:' + address + '\nPHOTO;ENCODING=BASE64;TYPE=JPEG:'+image+'\nEND:VCARD';
        await fs.promises.writeFile(path.join(__dirname, 'vcf',`output-${timestamp}.vcf`), vcard);
        let filename = path.join('http://moiravirtualassistant.com/vcard/moisesmari/',`output-${timestamp}.vcf`);
        console.log("vcf created");

        // render the template with the user input data
        const html = ejs.renderFile('views/template.ejs', { name, phone, address, email, facebook, whatsapp, twitter, instagram, linkedin, image, filename  });

        const subpageContent = await ejs.renderFile('views/template.ejs', { name, phone, address, email, facebook, whatsapp, twitter, instagram, linkedin, image, filename  });
        await fs.promises.writeFile(path.join(__dirname, 'businesscard',`subpage-${timestamp}.html`), subpageContent);

        // write the rendered HTML to a file
        await fs.promises.writeFile(`subpage-${timestamp}.html`, subpageContent);
        console.log(`subpage-${timestamp}.html created`);
        res.json(`Subpage subpage-${timestamp}.html and vcard output-${timestamp}.vcf created successfully`);
        
        // add the express route for the subpage
        app.get(/subpage-${timestamp}, (req, res) => {
        res.sendFile(path.resolve(__dirname, 'views', subpage-${timestamp}.html));
        });

        const fileHistory = [];

        console.log = (...args) => {
          const words = args.filter(arg => typeof arg === "string");
          fileHistory.push(words.join(" "));
        };
        
        process.on("exit", () => {
          fs.writeFileSync("history.html", fileHistory.join("\n"), "utf-8");
        });


        // function to write the logs to an HTML file
        async function writeToHTML(log) {
          // define the log file path
          const logFilePath = path.resolve(__dirname, 'views', 'logs.html');
          
          // read the current content of the log file
          let logFileContent = '';
          try {
            logFileContent = await fs.promises.readFile(logFilePath, 'utf8');
          } catch (error) {
            // if the file does not exist, create it
            if (error.code === 'ENOENT') {
              logFileContent = '<html><head><title>Logs</title></head><body><ul>';
            } else {
              throw error;
            }
          }

          // append the new log to the file content
          logFileContent += `<li><a href="subpage-${timestamp}.html">subpage-${timestamp}.html</a> created</li>`;

          // write the updated content to the log file
          await fs.promises.writeFile(logFilePath, logFileContent);
        }

        // ... rest of the code

        // write the console log to the HTML file
        writeToHTML(`www.subpage-${timestamp}.html created`);
        

      }} catch (err) {
        console.log(err);
        res.status(500).send('An error occurred while creating the subpage');
        }
        });

        

        

        
        app.get('/subpage-latest.html', (req, res) => {
        // get the name of the latest created html file
        let latestHtmlFile = getLatestHtmlFile();
        // read the content of the file
        let fileContent = fs.readFileSync(latestHtmlFile, "utf8");
        // send the content of the file as the response
        res.send(fileContent);
        });
        
        function getLatestHtmlFile() {
        // get the names of all the files in the directory where the index.js file is located
        let files = fs.readdirSync(__dirname);
        // filter out the files that are not HTML files
        files = files.filter(file => file.endsWith('.html'));
        // sort the files by modified date
        files.sort((a, b) => {
        return fs.statSync(path.join(__dirname, b)).mtime.getTime() -
        fs.statSync(path.join(__dirname, a)).mtime.getTime();
        });
        // return the first file in the sorted list
        return files[0];
        }


        
        
        
        app.listen(3000, () => {
        console.log('Server running on port 3000');
        });
