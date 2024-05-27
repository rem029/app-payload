export const generateEmployeeSurveyHTML = (url: string): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,300;0,400;0,500;0,700;1,400&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Montserrat', sans-serif;
            padding: 40px;
            background-color: #f0f2f5;
            color: #333;
        }
        h1 {
            color: #C7A965;
            font-weight: 700;
            margin-bottom: 20px;
        }
        p {
            font-weight: 300;
            line-height: 1.2;
        }
        a {
            display: inline-block;
            background-color: #C7A965;
            color: #ffffff;
            padding: 10px 20px;
            margin-top: 20px;
            border-radius: 5px;
            text-decoration: none;
            font-weight: 500;
        }
        a:hover {
            background-color: #B69665; /* Slightly darker for hover effect */
        }
    </style>
    <title>Rem Apps Employee Survey</title>
</head>
<body>
    <h1>Rem Apps Employee Survey</h1>
    <p>Please complete this employee survey</p>
    <a href="${url}" target="_blank">Start Survey</a>
</body>
</html>
    `;
};
