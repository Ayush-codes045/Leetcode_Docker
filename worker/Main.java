     import java.util.*;
     class Main {
       public static void main(String[] args) {
         Scanner sc = new Scanner(System.in);
         if (!sc.hasNextLong()) return;
         long a = sc.nextLong();
         if (!sc.hasNextLong()) return;
         long b = sc.nextLong();
         System.out.println(a - b);
       }
     }