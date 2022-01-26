import psycopg2

con = psycopg2.connect(
    host='steamproject.acnic.nl',
    database='SteamProject',
    user='jsCode',
    password='Studentje1'
)


def sqlSelect(attribute, table, additionalData):
    """
    SQL Script to select information from a database

    EXAMPLE:
        sqlSelect("*", "producten", "ORDER BY naam DESC")

    :parameter attribute: attribute for the database
    :parameter table: table to select from
    :parameter additionalData: extra attributes
    :type attribute: str
    :type table: str
    :type additionalData: str
    :returns: list
    """
    cur = con.cursor()
    select = f"SELECT {attribute} FROM {table} {additionalData}"
    cur.execute(select)
    fetchedSelects = cur.fetchall()
    cur.close()
    return fetchedSelects


def sqlInsert(table, column, values, additionalData, fetch=None):
    """
    SQL Script to insert items into a database.

    EXAMPLE:
        sqlInsert("artikel", "artnr, naam, adviesprijs", "460, 'Tandpasta', 1.65", "", True)

    :param table: table to select from
    :param column: columns to insert to
    :param values: values to insert in the columns
    :param additionalData: extra data, for example 'RETURNING'
    :param fetch: to fetch one line back, if desired then True else None
    :type fetch: bool
    :rtype fetch=True: list
    """
    cur = con.cursor()
    insert = f"INSERT INTO {table} ({column}) VALUES ({values}) {additionalData}"
    cur.execute(insert)
    if fetch:
        id = cur.fetchone()[0]
        con.commit()
        cur.close()
        return id
    else:
        con.commit()
        cur.close()


def sqlUpdate(table, set, additionalData):
    """
    SQL Script to update items into a database.

    EXAMPLE:
        sqlUpdate("klant", "adres = 'Amersfoortse Weg 7'", "WHERE plaats = 'DOORN'")

    :param table: the table to update
    :param set: the values to set
    :param additionalData: additional data to update, for example WHERE ... = ...
    :type parameters: str
    """
    cur = con.cursor()
    update = f"UPDATE {table} SET {set} {additionalData}"
    cur.execute(update)
    con.commit()
    cur.close()


def sqlCustom(Query):
    """SQL Script to input custom command to Postgresql Database."""
    cur = con.cursor()
    cur.execute(Query)
    con.commit()
    cur.close()
