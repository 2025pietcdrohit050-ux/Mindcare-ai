import java.sql.*;
import java.io.*;

public class DB {
    Connection con;
    PreparedStatement pst;
    ResultSet rs;

    DB() {
        String URL = "jdbc:mysql://localhost:3306/test";
        String USER = "root";
        String PASSWORD = "root";

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            con = DriverManager.getConnection(URL, USER, PASSWORD);
            System.out.println("Database connected successfully");
        } catch (Exception e) {
        }

        loadData();
    }

    void loadData() {
        try {
            pst = con.prepareStatement("select * from student");
            rs = pst.executeQuery();

            while (rs.next()) {
                System.out.println("ID = " + rs.getInt("student_id"));
                System.out.println("Name = " + rs.getString("name"));
                System.out.println("Address = " + rs.getString("address"));
            }
        } catch (SQLException e) {
        }
    }

    void insertData() throws Exception {
        BufferedReader br = new BufferedReader(
                new InputStreamReader(System.in));

        int id;
        String n, a;

        System.out.println("Enter id");
        id = Integer.parseInt(br.readLine());

        System.out.println("Enter Name");
        n = br.readLine();

        System.out.println("Enter Address");
        a = br.readLine();

        pst = con.prepareStatement("insert into student values(?,?,?)");
        pst.setInt(1, id);
        pst.setString(2, n);
        pst.setString(3, a);

        pst.executeUpdate();

        System.out.println("Record Inserted");
    }

    public static void main(String[] args) {
        new DB();
    }
}