CREATE TABLE products(
    id INT NOT NULL,
    name STRING,
    price MONEY,
    PRIMARY KEY (id)
);

INSERT INTO products
VALUES (1,'Pen',1.20);

INSERT INTO products
VALUES (2, 'Pencil',0.80);

INSERT INTO products
VALUES (3, 'Eraser',0.60);

SELECT * FROM products;

UPDATE products
SET price=1.4
WHERE price=1.2;

ALTER TABLE products
ADD quantity INT;

UPDATE products
SET quantity=30
WHERE quantity IS NULL;

DELETE FROM products
WHERE id=3;

SELECT * FROM products;