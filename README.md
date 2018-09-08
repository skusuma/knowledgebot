# Knowledgebot
Create a knowledge bot that learns actively. Follow these simple steps:

Upload/link a FAQ document to [QnAMaker]: https://qnamaker.ai/

Test and publish the QnA using the simulator provided in the qnamaker site.

Note the URL.

Create an Azure BotService. It gives you a template using which you can associate the QnAMaker

You can associate LUIS also to add more intelligence to your plain vanilla QnAMaker based bot

Here's the architecture:
![](images/arch.png?raw=true "Architecture Diagram")

