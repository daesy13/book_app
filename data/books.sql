DROP TABLE IF EXISTS books;

CREATE TABLE IF NOT EXISTS books (
  id SERIAL PRIMARY KEY NOT NULL,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  isbn VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(255) NOT NULL
);

INSERT INTO books (title, author, isbn, description, image_url)
VALUES('Playing Harry Potter', 'Lisa S. Brenner', '9781476621364', 'Through classroom activities, wizard rock concerts, and organizations like the Harry Potter Alliance, Harry Potter fans are using creativity to positively impact the world. This collection of essays and interviews examines how playful fandom—from fanfiction to Muggle quidditch, cosplay, role-playing games, and even Harry Potter burlesque—not only reimagines the canon but also challenges consumerism, questions notions of identity, and fosters participatory culture. The contributors explore issues applicable to fan studies and performance studies at large, such as the role of performance, the nature of community, and questions of representation and ownership in the digital age. Presented in three parts, the essays discuss discrepancies between sanctioned versions of Harry Potter and fan creations, the reenactment and reinterpretation of the original narrative in fan performance, and collaborative and participatory performances that break down the boundaries between actors and audiences.', 'http://books.google.com/books/content?id=zb3wCQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api');

INSERT INTO books (title, author, isbn, description, image_url)
VALUES('The Poems of Emily Dickinson', 'Emily Dickinson', '0674676017', 'Ralph Franklin has prepared an authoritative one-volume edition of all extant poems of Emily Dickinson - 1.789 poems in all, the largest number ever assembled. This reading edition derives from his three-volume work, which contains approximately 2.500 sources for the poems. In this one-volume edition, Franklin offers a single reading of each poem - usually the latest version of the entire poem - rendered with Dickinsons spelling, punctuation and capitalization intact.', 'http://books.google.com/books/content?id=LoH2SXEnnoEC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api');

INSERT INTO books (title, author, isbn, description, image_url)
VALUES('To Kill a Mockingbird', 'Harper Lee', '0871299208', 'Required reading in most high schools, this Pulitzer Prize winning novel was originally published in 1969 and was voted the best book of the century by Library Journal.', 'http://books.google.com/books/content?id=0NEbHGREK7cC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api');

INSERT INTO books (title, author, isbn, description, image_url)
VALUES('Becoming', 'Michelle Obama', '9781524763138', 'In a life filled with meaning and accomplishment, Michelle Obama has emerged as one of the most iconic and compelling women of our era. As First Lady of the United States of America, she helped create the most welcoming and inclusive White House in history. With unerring honesty and lively wit, she describes her triumphs and her disappointments, both public and private. A deeply personal reckoning of a woman of soul and substance who has steadily defied expectations.', 'http://books.google.com/books/content?id=hi17DwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api');
